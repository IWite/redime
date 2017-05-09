// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { HomePage } from '../home/home'
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { FirebaseService } from '../../providers/firebase-service'
import { ComunService } from '../../providers/comun-service'
import { UserBack } from '../../providers/user-back'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';
import { DatosUsuario } from '../../interfaces'



@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    // -----------------------------------------------------------------
    // Atributos
    // -----------------------------------------------------------------

    opt = {
        bordeColor: '2px solid #00e4a6',
        padding: '4px',
        size: '20vh',
        icon: 'ios-camera-outline',
        iconStyle: {
            "font-size": "17vh",
            "color": "#004160",
        }
    }

    foto: any

    baseImage: string


    // -----------------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------------
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public firebaseService: FirebaseService,
        public comun: ComunService,
        public zone: NgZone,
        public userBack: UserBack) {

        this.userBack.load.dismiss()
        this.userBack.load = this.comun.showLoad('Cargando')
        if (this.userBack.user.photoURL != '')
            this.foto = this.userBack.user.photoURL

    }

    // -----------------------------------------------------------------
    // Metodos
    // -----------------------------------------------------------------
    ionViewDidLoad() {
        document.getElementsByClassName('datetime-text')[0].innerHTML = 'Fecha nacimiento'
    }

    createCount() {
        let infoUser: DatosUsuario = {
            padre: '',
            foto: this.userBack.user.photoURL,
            nombre: this.userBack.user.displayName,
            infoPuntos: {
                consumo: 0,
                numAmigos: 5,
                puntos: 0,
                puntosRed: 0
            }
        }
        this.userBack.crearUsuario(infoUser).then(
            () => {
                this.navCtrl.setRoot(HomePage)
            }
        )
    }

    tomarFoto() {
        this.comun.getImageCamaraOrGalery().then(
            data => {
                this.baseImage = data,
                    this.foto = data
            },
            err => console.log(err)
        )
    }

    registrar() {
        this.userBack.load.present()
        if (this.baseImage) {
            let storageRef = firebase.storage().ref();
            let bold = this.comun.dataURItoBlob(this.baseImage)
            let uploadTask = storageRef.child(this.userBack.user.uid + '.jpg').put(bold);
            uploadTask.on('state_changed',
                snapshot => {
                    let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                err=>{
                    this.userBack.load.dismiss()
                    this.comun.showAlert('Error',err.message)
                },
                ()=>{
                    let downloadURL = uploadTask.snapshot.downloadURL;
                    this.firebaseService.updateInfoUser(this.userBack.user.displayName,downloadURL).then(
                        ()=>  this.createCount()
                    )
                }
            )
        }
        else
            this.createCount()
    }



}
