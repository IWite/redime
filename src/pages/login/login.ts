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
import { CreateCountPage } from '../create-count/create-count';
import { RegisterPage } from '../register/register'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';

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

	pushpag = CreateCountPage

	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public firebaseService: FirebaseService,
		public comun: ComunService,
		public userBack: UserBack) {

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
	registerEmail() {
		if (!this.email || !this.password)
			this.comun.showAlert('Error', 'Ingrese un correo y una contraseña')
		else
			this.firebaseService.registerEmail(this.email, this.password).catch(
				err => this.comun.showAlert('Erros', err)
			)
	}

	loginFacebook() {
		this.firebaseService.signInFacebook().catch(
			err => console.log(err)
		)
	}

	recordar() {
		let ponp = this.comun.alertCtrl.create({
			title: 'Recuperar contraseña',
			message: 'Ingrese el correo de su cuenta',
			inputs: [
				{
					name: 'correo',
					placeholder: 'Correo'
				},
			],
			buttons: [
				{
					text: 'Cancelar',
					handler: data => { }
				},
				{
					text: 'Enviar',
					handler: data => {
						firebase.auth().sendPasswordResetEmail(data['correo']).then(
							ok => {
								console.log(ok);
								this.comun.showAlert('Correo enviado', 'Se ha enviado un correo para restablecer la contraseña')
							},
							err => {
								let er = this.firebaseService.getErrorReset(<firebase.FirebaseError>err)
								this.comun.showAlert('Error', er)
							}
						)
					}
				}
			]
		})
		ponp.present()
	}


}
