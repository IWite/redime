// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component, NgZone, } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { ToastController, LoadingController } from 'ionic-angular';
import { Camera } from 'ionic-native';
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { UserBack } from '../../providers/user-back'
import { ComunService } from '../../providers/comun-service'
import { HomeBack } from '../../providers/home-back'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import { QRCodeComponent } from 'angular2-qrcode';
import { CodigoComponent } from '../../components/codigo/codigo'
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Clipboard } from '@ionic-native/clipboard';
import * as firebase from 'firebase';




@Component({
	selector: 'page-principal',
	templateUrl: 'principal.html',
	providers: [HomeBack]
})
export class PrincipalPage {

	puntos: number
	arbol: number

	subscrip: Array<Subscription> = []

	nombre: string
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
			"align-self": "flex-start",
			"font-size": "17vh",
			"color": "#004160"
		}
	}

	opt2 = {
		bordeColor: '2px solid #004160',
		padding: '0',
		size: '10vh',
		icon: 'ios-camera-outline',
		iconStyle: {
			"font-size": "8vh",
			"color": "#004160"
		}
	}

	opt3 = {
		bordeColor: '2px solid #004160',
		padding: '0',
		size: '10vh',
		icon: 'ios-cash-outline',
		iconStyle: {
			"font-size": "6vh",
			"color": "#004160"
		}
	}


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public userBack: UserBack,
		public zone: NgZone,
		public comun: ComunService,
		private homeBack: HomeBack,
		private clipboard: Clipboard,
		public toastCtrl: ToastController,
		private barcodeScanner: BarcodeScanner,
		public loadingCtrl: LoadingController
	) {

		// -----------------------------------------------------------------
		// Observador puntos
		// -----------------------------------------------------------------
		let obs = userBack.puntosObserv.subscribe(punt => {
			this.zone.run(() => this.puntos = punt)
		})
		this.subscrip.push(obs)
		// -----------------------------------------------------------------
		// Observador puntos red
		// -----------------------------------------------------------------
		let ob2 = userBack.puntosRedObserv.subscribe(pts => {
			this.zone.run(() => this.arbol = pts)
		})
		this.subscrip.push(ob2)

		this.userBack.darPuntosRed()
		this.userBack.darPuntos()

		this.nombre = this.userBack.user.displayName.split(' ')[0]
		this.foto = this.userBack.user.photoURL
		this.email = this.userBack.user.email
		this.codigo = this.userBack.datosUsuatio.cod_usr

		this.userBack.load.dismiss()

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

	salir() {
		firebase.auth().signOut()
	}

	copiar() {
		this.clipboard.copy(this.codigo);
		let toast = this.toastCtrl.create({
			message: 'Código copiado',
			duration: 2000,
			position: 'top'
		});
		toast.present()

	}

	escan() {


		let cameraOptions = {
			sourceType: Camera.PictureSourceType.CAMERA,
			destinationType: Camera.DestinationType.DATA_URL,
			quality: 100,
			targetWidth: 600,
			targetHeight: 600,
			encodingType: Camera.EncodingType.JPEG,
			correctOrientation: true
		}

		Camera.getPicture(cameraOptions).then(imageData => {
			let loader = this.loadingCtrl.create({
				content: 'Cargando...',
			});
			loader.present()
			let base64Image = 'data:image/jpeg;base64,' + imageData;
			let bold = this.comun.dataURItoBlob(base64Image)

			let storageRef = firebase.storage().ref()
			let time = new Date().getTime()
			let uploadTask = storageRef.child('facturas/' + time + '.jpg').put(bold)
			uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
				snapshot => {
					let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log('Upload is ' + progress + '% done');
				},
				err => {
					loader.dismiss()
					this.comun.showAlert('Error', err.message)
				},
				() => {
					let downloadURL = uploadTask.snapshot.downloadURL
					let user = firebase.auth().currentUser
					firebase.database().ref('facturas').push({
						user: user.uid,
						photo: downloadURL
					}, (a) => {
						loader.dismiss()
						this.comun.showAlert('Gracias', 'El equipo de redime validará tu factura y muy pronto sumaremos tus puntos')
					})

				}
			)
		})

	}

	pagar() {
		let alert = this.comun.alertCtrl.create({
			title: 'Paga con RediCash',
			message: 'Ingresa el monto a pagar con RediCash',
			inputs: [
				{
					name: 'monto',
					placeholder: 'Cantidad',
					type: 'number'
				}
			],
			buttons: [
				{
					text: 'Continuar',
					handler: data => {
						this.validarCompra(data['monto'])
					}
				},
				{
					text: 'Cerrar',
					role: 'Cerrar',
					handler: data => { }
				}
			]
		})
		alert.present()
	}

	validarCompra(monto) {
		let isnum = !isNaN(parseFloat(monto)) && isFinite(monto)
		if (!isnum)
			this.comun.showAlert('Error', 'Ingresa un valor valido')
		else {
			let valor = Math.round(monto)
			if (valor > this.puntos)
				this.comun.showAlert('Error', 'No tienes suficiente RediCash')
			else
				this.barcodeScanner.scan().then(
					data => {
						if (this.userBack.listaKeyRes[data['text']] != null) {
							let load = this.comun.showLoad('Cargando...')
							load.present()
							let user = firebase.auth().currentUser
							firebase.database().ref('restaurante').child(data['text']).child('pagos').push({
								nombre: this.userBack.datosUsuatio.nombre,
								cod: this.userBack.datosUsuatio.cod_usr,
								monto: valor
							})
							firebase.database().ref('usuarios').child(user.uid).child('infoPuntos').transaction(data => {
								if (data) {
									data['puntos'] -= valor
								}
								return data
							}, (a, b, c) => {
								load.dismiss()
								this.comun.showAlert('Transacción terminada', 'Se descontaron ' + valor + ' de tu RediCash')
							})
						}
						else if (!data['cancelled'])
							this.comun.showAlert('Error', 'Código invalido')
					},
					err => {
						console.log(err)
					}
				)
		}


	}



}


