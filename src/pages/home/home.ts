// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestaurantesPage } from '../restaurantes/restaurantes'
// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import { HomeBack } from '../../providers/home-back'
import { UserBack } from '../../providers/user-back'
import { PrincipalPage } from '../principal/principal'
import { Amigos } from "../amigos/amigos";
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';
import * as _ from 'underscore'

@Component({
	selector: 'page-home',
	templateUrl: 'home.html',
	providers: [HomeBack]
})
export class HomePage {
	// -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------
	tab1Root: any;
	tab2Root: any;
	tab3Root: any
	titulo: string;

	constructor(public navCtrl: NavController, private homBack: HomeBack, private userbac: UserBack) {
		this.tab1Root = PrincipalPage;
		this.tab2Root = Amigos;
		this.tab3Root = RestaurantesPage


		// firebase.database().ref('usuarios').once('value', snap => {
		// 	let usuarios = snap.val()
		// 	console.log(usuarios)

		// 	_.each(usuarios, (usuario, key) => {
		// 		if (usuario['hijos'] != null) {
		// 			let listaHijos = Object.keys(usuario['hijos'])
		// 			_.each(listaHijos,hijo=>{
		// 				usuarios[hijo].padre = key
		// 			})
		// 		}
		// 		if(usuario['padre'] == null || usuario['padre'] == '')
		// 			usuario['padre'] = '-'
		// 	})

		// 	firebase.database().ref('usuarios').set(usuarios)
			
		// })


	}

	ionViewDidLoad() {
	}

	openModal() {
		firebase.database().ref('porceRestaurantes/r1').once('value', snap => {
			let datos = snap.val()
			this.homBack.agregarCompra(10000, datos, this.userbac.datosUsuatio.padre, 'r1')
		})

	}
}