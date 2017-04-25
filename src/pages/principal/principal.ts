// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component, NgZone, } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { UserBack } from '../../providers/user-back'
import { ComunService } from '../../providers/comun-service'
import { HomeBack } from '../../providers/home-back'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import {QRCodeComponent} from 'angular2-qrcode';
import { CodigoComponent } from '../../components/codigo/codigo'
import { BarcodeScanner } from 'ionic-native';
import * as firebase from 'firebase';




@Component({
	selector: 'page-principal',
	templateUrl: 'principal.html',
	providers: [HomeBack]
})
export class PrincipalPage {

	puntos: string
	arbol: string

	subscrip: Array<Subscription> = []

	nombre:string
	foto: string
	email: string
	fecha: string
	codigo: string

	opt = {
		bordeColor: '2px solid #00e4a6',
		padding: '2px',
		size: '15vh',
		icon: 'md-person',
		iconStyle: {
			"align-self":"flex-start",
			"font-size": "17vh"
		}
	}

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public userBack: UserBack,
		public zone: NgZone,
		public comun: ComunService,
		private homeBack: HomeBack) {

		// -----------------------------------------------------------------
		// Observador puntos
		// -----------------------------------------------------------------
		let obs = userBack.puntosObserv.subscribe(punt => {
			if (punt)
				this.zone.run(() => this.puntos = this.homeBack.formatDollar(punt))
			else
				this.zone.run(() => this.puntos = this.homeBack.formatDollar(0))
		})
		this.subscrip.push(obs)
		// -----------------------------------------------------------------
		// Observador puntos red
		// -----------------------------------------------------------------
		let ob2 = userBack.puntosRedObserv.subscribe(pts => {
			if (pts)
				this.zone.run(() => this.arbol = this.homeBack.formatDollar(pts))
			else
				this.zone.run(() => this.arbol = this.homeBack.formatDollar(0))
		})
		this.subscrip.push(ob2)

		this.userBack.darPuntosRed()
		this.userBack.darPuntos()

		this.nombre = this.userBack.user.displayName
		this.foto = this.userBack.user.photoURL
		this.email = this.userBack.user.email
		this.fecha = this.userBack.datosUsuatio.fecha
		this.codigo = this.userBack.datosUsuatio.cod_usr

	}

	ionViewDidLoad() {
		
	}



	modal() {
		let modal = this.modalCtrl.create(CodigoComponent, { cod: this.userBack.datosUsuatio.cod_usr });
		modal.present();
	}

	canjearPuntos() {
		this.userBack.canjearPunto().then(info => {
			this.comun.showAlert('Mensaje', info)
		})
	}

	salir(){
		firebase.auth().signOut()
	}



}
