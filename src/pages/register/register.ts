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



@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    // -----------------------------------------------------------------
    // Atributos
    // -----------------------------------------------------------------

    /** Nombre del usuario */
    nombre: string

    /** fecha del usuario */
    fecha: string

    /** cedula del usuario */
    cedula: string

    /** url de la foto */
    foto: string

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
        this.nombre = userBack.user.displayName
        this.foto = userBack.user.photoURL
    }

    // -----------------------------------------------------------------
    // Metodos
    // -----------------------------------------------------------------
    ionViewDidLoad() {
        document.getElementsByClassName('datetime-text')[0].innerHTML = 'Fecha nacimiento'
    }


    tomarFoto() {
        this.comun.getImageCamaraOrGalery().then(
            data => this.zone.run(() => this.foto = data),
            err => console.log(err)
        )
    }

    /**
   * Finaliza el registro de la aplicación
   * @memberOf RegisterPage
   */
    entrar() {
        if (!this.nombre || !this.fecha || !this.cedula) {
            this.comun.showAlert('Error', 'Debes llenar todos los campos')
        }
        else {

            let loading = this.comun.showLoad('Cargando...')
            loading.present();
            let infoUser = {
                fecha: this.fecha,
                cedula: this.cedula,
                puntos: 0,
                puntosRed:0,
                numAmigos:5,
                consumo:0
            }
            this.firebaseService.updateInfoUser(this.nombre, this.foto)
            this.userBack.crearUsuario(infoUser).then(
                ()=>{
                    loading.dismiss()
                    this.navCtrl.setRoot(HomePage)
                }
            )
        }
    }

    stringGen(len: number): string {
        let text = "";

        let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#-";

        for (let i = 0; i < len; i++)
            text += charset.charAt(Math.floor(Math.random() * charset.length));

        return text;
    }

}
