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

    /** fecha del usuario */
    fecha: string


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

    }

    // -----------------------------------------------------------------
    // Metodos
    // -----------------------------------------------------------------
    ionViewDidLoad() {
        document.getElementsByClassName('datetime-text')[0].innerHTML = 'Fecha nacimiento'
    }

    createCount() {
        debugger
        if (!this.fecha)
            this.comun.showAlert('Error', 'Debes llenar todos los campos')
        else {
            let loading = this.comun.showLoad('Cargando...')
            loading.present()
            let infoUser: DatosUsuario = {
                fecha: this.fecha,
                infoPuntos: {
                    consumo: 0,
                    numAmigos: 5,
                    puntos: 0,
                    puntosRed: 0
                }
            }
            this.userBack.crearUsuario(infoUser).then(
                () => {
                    loading.dismiss()
                    this.navCtrl.setRoot(HomePage)
                }
            )

        }
    }



}
