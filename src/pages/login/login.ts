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

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class LoginPage {
	// -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	email: string

	password: string

	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public firebaseService: FirebaseService,
		public comun: ComunService) {

	}

	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------
	ionViewDidLoad() {
		console.log('ionViewDidLoad LoginPage');
	}

	/**
	 * Login with email
	 * @memberOf LoginPage
	 */
	loginEmail() {
		if (!this.email || !this.password)
			this.comun.showAlert('Error', 'Ingrese un correo y una contraseña')
		else
			this.firebaseService.sigInEmail(this.email, this.password).catch(
				err => this.comun.showAlert('Error', err)
			)
	}

	/**
	 * Register with email
	 * @memberOf LoginPage
	 */
	registerEmail(){
		if (!this.email || !this.password)
			this.comun.showAlert('Error', 'Ingrese un correo y una contraseña')
		else
			this.firebaseService.registerEmail(this.email,this.password).catch(
				err => this.comun.showAlert('Erros',err)
			)
	}

	loginFacebook(){
		this.firebaseService.signInFacebook().catch(
			err=> console.log(err)
		)
	}


}
