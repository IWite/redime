// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { FirebaseService } from '../../providers/firebase-service'
import { ComunService } from '../../providers/comun-service'
import { UserBack } from '../../providers/user-back'
// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { HomePage } from '../home/home';
import { RegisterPage } from '../register/register'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import { DatosUsuario } from '../../interfaces'

@Component({
  selector: 'page-create-count',
  templateUrl: 'create-count.html'
})
export class CreateCountPage {

  // -----------------------------------------------------------------
  // Atributos
  // -----------------------------------------------------------------

  nombre: string

  email: string

  password: string

  fecha: string

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseService: FirebaseService,
    public comun: ComunService,
    public userBack: UserBack) {

  }

  // -----------------------------------------------------------------
  // Metodos
  // -----------------------------------------------------------------

  ionViewDidLoad() {
    document.getElementsByClassName('datetime-text')[0].innerHTML = 'Fecha nacimiento'
    let a  = document.getElementsByClassName('scroll-content')
		console.log(a);
  }

  /**
	 * Register with email
	 * @memberOf LoginPage
	 */
  registerEmail() {
    if (!this.email || !this.password || !this.nombre || !this.fecha)
      this.comun.showAlert('Error', 'Debes llenar todos los campos')
    else {
      let loading = this.comun.showLoad('Cargando...')
      loading.present()
      this.firebaseService.registerEmail(this.email, this.password).then(
        user => {
          this.firebaseService.updateInfoUser(this.nombre, '')
          let infoUser: DatosUsuario = {
            fecha: this.fecha,
            padre:'',
            nombre: this.nombre,
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

        },
        err => {
          loading.dismiss()
          this.comun.showAlert('Erros', err)
        }
      )
    }
  }


  loginFacebook() {
    this.firebaseService.signInFacebook().catch(
      err => console.log(err)
    )
  }

}
