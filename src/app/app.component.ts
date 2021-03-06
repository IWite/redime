// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register'
import { HomePage } from '../pages/home/home'
import { HistorialPage } from '../pages/historial/historial'
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import {UserBack} from '../providers/user-back'
import { ComunService } from "../providers/comun-service";
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';

declare const ENV;




@Component({
	templateUrl: 'app.html'
})
export class MyApp {

	// -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	@ViewChild(Nav) nav: Nav;

	rootPage: any;

	pages: Array<{ title: string, component: any }>;

	// -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------
	constructor(public platform: Platform, private userBack : UserBack, private zone: NgZone, private comun: ComunService) {
		this.initializeApp();
		// inicializa el servicio de firebase
		firebase.initializeApp(ENV.data.firebase_config)
		// Estructura para navegar entre páginas
		this.pages = [
			{ title: 'Principal', component: HomePage },
			{ title: 'Historial', component: HistorialPage}
		];

	}

	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------

	/**
	 * Function that generate logic where device is ready
	 * @memberOf MyApp
	 */
	initializeApp() {
		this.platform.ready().then(() => {
			StatusBar.styleDefault();
			this.userBack.load = this.comun.showLoad('Cargando...')
			this.userSatate()
		});
	}

	/**
	 * Open a page of navigate
	 * @param {any} page
	 * @memberOf MyApp
	 */
	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}

	
	/**
	 * Cierra sesion en la app
	 * @memberOf MyApp
	 */
	salir(){
		firebase.auth().signOut()
	}

	/**
	 * Check state of user 
	 * @memberOf MyApp
	 */
	userSatate() {
		firebase.auth().onAuthStateChanged(((user: firebase.User) => {
			if(user){
				Splashscreen.hide();
				this.userBack.iniciar(user)
				firebase.database().ref('usuarios/' + user.uid + '/').once('value',snap=>{
					if(snap.val()){
						this.zone.run(()=>this.nav.setRoot(HomePage))
					}
					else{
						this.zone.run(()=>this.nav.setRoot(RegisterPage))
					}	
				})
			}
			else{
				this.zone.run(()=>this.nav.setRoot(LoginPage))
			}
		}))
	}
}
