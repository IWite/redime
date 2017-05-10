// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunService } from "../../providers/comun-service";

// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';


@Component({
	selector: 'page-restaurantes',
	templateUrl: 'restaurantes.html'
})
export class RestaurantesPage {

	opt = {
		bordeColor: '1px solid #00e4a6',
		padding: '2px',
		size: '10vh',
		icon: 'md-restaurant',
		iconStyle: {
			"font-size": "8vh"
		}
	}

	wMap
	hMap = 180
	idr: string

	listaRestaurantes = []

	constructor(public navCtrl: NavController, public navParams: NavParams, private launchNavigator: LaunchNavigator, public platform: Platform, private comun: ComunService) {
		this.wMap = window.innerWidth - 32
		firebase.database().ref('restaurante').on('child_added', snap => {
			this.listaRestaurantes.push(snap.val())
		})
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad RestaurantesPage');
	}

	abrir(idrest) {

	}

	navegar(latitud, longitud) {
		this.launchNavigator.availableApps().then(
			lista => {
				let botones = []
				for (let app in lista) {
					console.log(this.launchNavigator.getAppDisplayName(app))
					if (lista[app]) {
						botones.push({
							text: this.launchNavigator.getAppDisplayName(app),
							handler: () => {
								let options: LaunchNavigatorOptions = {
									app: app
								}
								this.launchNavigator.navigate(latitud + ',' + longitud, options).then(
									success => console.log('Launched navigator'),
									error => console.log('Error launching navigator', error)
								)
							}
						})
					}
				}
				let action = this.comun.actionSheetCtrl.create({
					title: 'Selecciona una opción',
					buttons: botones
				})
				action.present()

			},
			err => console.log(err)

		)
	}

}
