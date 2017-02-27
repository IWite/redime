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
import { QRCodeComponent } from 'ng2-qrcode'
import { CodigoComponent } from '../../components/codigo/codigo'
import { BarcodeScanner } from 'ionic-native';



@Component({
	selector: 'page-principal',
	templateUrl: 'principal.html',
	providers: [HomeBack]
})
export class PrincipalPage {

	puntos: string
	arbol: string

	subscrip: Array<Subscription> = []

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
	}


	modal() {
		let modal = this.modalCtrl.create(CodigoComponent, { cod: this.userBack.datosUsuatio.cod_usr });
		modal.present();
	}

	opcionAgregar() {
		let jos = {
			title: 'Agregar',
			buttons: [
				{
					text: 'Escanear código',
					icon: 'md-qr-scanner',
					handler: () => this.agreggarConScan(),
				},
				{
					text: 'Escribir código',
					icon: 'md-create',
					handler: () => this.agreggarConTexto(),
				},
				{
					text: 'Cerrar',
					handler: () => console.log('escribir'),
					role: 'cancel'
				}
			]
		}
		this.comun.getActionSheet(jos)
	}

	agreggarConScan() {
		BarcodeScanner.scan({
			formats: 'QR_CODE',
			prompt: 'Escánea el código QR'
		}).then((barcodeData) => {
			this.agregar(barcodeData.text)
		}, (err) => {
			this.comun.showAlert('Error', err)
		});
	}

	agreggarConTexto() {
		let js2 = {
			title: 'Escriba el código',
			inputs: [
				{
					name: 'cod',
					placeholder: 'Código'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					role: 'cancel',
					handler: data => {
						console.log('Cancel clicked');
					}
				},
				{
					text: 'Agregar',
					handler: data => {
						this.agregar(data['cod'])
					}
				}
			]
		}
		let tem = this.comun.alertCtrl.create(js2)
		tem.present()
	}

	agregar(cod: string) {
		debugger
		if (cod == this.userBack.datosUsuatio.cod_usr)
			this.comun.showAlert('Error', 'Código no valido')
		else if (this.userBack.datosUsuatio.hijos && Object.keys(this.userBack.datosUsuatio.hijos).length >= this.userBack.datosUsuatio.infoPuntos.numAmigos)
			this.comun.showAlert('Error', 'No puedes agregar más amigos')
		else {
			this.homeBack.agregarAmigo(cod, this.userBack.user.uid).then(
				hijo => {
					if (this.userBack.datosUsuatio.padre == hijo) {
						this.homeBack.borrarReferenciaHijo(hijo)
						this.comun.showAlert('Error', 'No se pudo agregar su hijo')
					}
					else
						this.validarUsuario(hijo)
				},
				err => {
					this.comun.showAlert('Error', err)
				}
			)
		}
	}

	validarUsuario(id: string) {
		if (!this.userBack.datosUsuatio.hijos) {
			this.userBack.datosUsuatio.hijos = {}
			this.userBack.datosUsuatio.hijos[id] = true
			this.homeBack.guardarAmigos(this.userBack.user.uid, this.userBack.datosUsuatio.hijos)
			this.comun.showAlert('Éxito', 'Su nuevo hijo se ha agregado')
		}
		else if (this.userBack.datosUsuatio[id])
			this.comun.showAlert('Error', 'Ya es tu hijo')
		else {
			this.userBack.datosUsuatio.hijos[id] = true
			this.homeBack.guardarAmigos(this.userBack.user.uid, this.userBack.datosUsuatio.hijos)
			this.comun.showAlert('Éxito', 'Su nuevo hijo se ha agregado')
		}
	}

	canjearPuntos(){
		this.userBack.canjearPunto().then(info=>{
			this.comun.showAlert('Mensaje',info)
		})
	}



}
