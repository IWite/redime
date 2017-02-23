// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component, ViewChild, NgZone } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { environment } from './environment';
// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register'
import { HomePage } from '../pages/home/home'
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import {UserBack} from '../providers/user-back'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';




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
	constructor(public platform: Platform, private userBack : UserBack, private zone: NgZone) {
		this.initializeApp();
		// inicializa el servicio de firebase
		firebase.initializeApp(environment.firebaseConfig)
		// Estructura para navegar entre páginas
		this.pages = [
			{ title: 'Page One', component: Page1 },
			{ title: 'Page Two', component: Page2 }
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
			Splashscreen.hide();
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
	 * Check state of user 
	 * @memberOf MyApp
	 */
	userSatate() {
		firebase.auth().onAuthStateChanged(((user: firebase.User) => {
			if(user){
				this.userBack.user = user
				firebase.database().ref('usuario/' + user.uid + '/').once('value',snap=>{
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
