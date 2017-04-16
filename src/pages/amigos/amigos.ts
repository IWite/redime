// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { ComunService } from "../../providers/comun-service";
import { UserBack } from "../../providers/user-back";
import { HomeBack } from "../../providers/home-back";
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import * as _ from 'underscore'
import * as firebase from 'firebase';
import { DatosUsuario } from "../../interfaces";


@Component({
	selector: 'page-amigos',
	templateUrl: 'amigos.html',
})
export class Amigos {
	// -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	listaKeyAmigos = {}
	listaAmigos = []

	listaReferencias = {}

	opt = {
		bordeColor: '1px solid #00e4a6',
		padding: '2px',
		size: '10vh',
		icon: 'md-person',
		iconStyle: {
			"align-self":"flex-start",
			"font-size": "17vh"
		}
	}

	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(public navCtrl: NavController, public navParams: NavParams, private comun: ComunService, private userBack: UserBack, private homeBack: HomeBack, private barcodeScanner: BarcodeScanner) {
		this.cargarAmigos()
	}


	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------

	/**
	 * Llama cuando carga el dom
	 * 
	 * 
	 * @memberOf Amigos
	 */
	ionViewDidLoad() {
		console.log('ionViewDidLoad Amigos');
	}

	/**
	 * Pop up con opciones para agregar amigos
	 * 
	 * 
	 * @memberOf Amigos
	 */
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

	/**
	 * Corre el plugin para escanear qr
	 * 
	 * 
	 * @memberOf Amigos
	 */
	agreggarConScan() {
		this.barcodeScanner.scan({
			formats: 'QR_CODE',
			prompt: 'Escánea el código QR'
		}).then((barcodeData) => {
			this.agregar(barcodeData.text)
		}, (err) => {
			this.comun.showAlert('Error', err)
		});
	}

	/**
	 * Abre un pop up para escribir el tcodigo
	 * 
	 * 
	 * @memberOf Amigos
	 */
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

	/**
	 * Agrega un amigo a la red
	 * 
	 * @param {string} cod Codigo del usuario
	 * 
	 * @memberOf Amigos
	 */
	agregar(cod: string) {
		if (cod == this.userBack.datosUsuatio.cod_usr)
			this.comun.showAlert('Error', 'Código no valido')
		else if (this.userBack.datosUsuatio.hijos && Object.keys(this.userBack.datosUsuatio.hijos).length >= this.userBack.datosUsuatio.numAmigos)
			this.comun.showAlert('Error', 'No puedes agregar más amigos')
		else {
			this.homeBack.agregarAmigo(cod, this.userBack.user.uid, this.userBack.datosUsuatio.padre).then(
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

	/**
	 * Valida la creacion del usuario
	 * 
	 * @param {string} id id del usuario agregado
	 * 
	 * @memberOf Amigos
	 */
	validarUsuario(id: string) {
		if (!this.userBack.datosUsuatio.hijos) {
			this.userBack.datosUsuatio.hijos = {}
			this.userBack.datosUsuatio.hijos[id] = true
			this.homeBack.guardarAmigos(this.userBack.user.uid, this.userBack.datosUsuatio.hijos)
			this.comun.showAlert('Felicitaciones', 'Has agregado un nuevo miembro a tu comunidad')
		}
		else if (this.userBack.datosUsuatio[id])
			this.comun.showAlert('Error', 'Ya es tu hijo')
		else {
			this.userBack.datosUsuatio.hijos[id] = true
			this.homeBack.guardarAmigos(this.userBack.user.uid, this.userBack.datosUsuatio.hijos)
			this.comun.showAlert('Felicitaciones', 'Has agregado un nuevo miembro a tu comunidad')
		}

	}

	cargarAmigos() {
		firebase.database().ref('usuarios/' + this.userBack.user.uid + '/hijos').on('child_added', snap => {
			let ref = firebase.database().ref('usuarios/' + snap.key)
			this.listaReferencias[snap.key] = ref
			ref.on('value', snap2 => {
				const datos = <DatosUsuario>snap2.val()
				let chan = {
					nombre: datos.nombre,
					photo: datos.foto,
					amig: (datos.hijos) ? Object.keys(datos.hijos).length : 0,
					pnts: this.homeBack.formatDollar(datos.infoPuntos.puntos),
					key: snap.key
				}
				this.listaKeyAmigos[snap.key] = chan
				this.listaAmigos = _.values(this.listaKeyAmigos)
			})
		})
	}

	delet(key: string) {
		let confirm = this.comun.alertCtrl.create({
			title: 'Cuidado',
			message: '¿Esta seguro de eliminar a tu amigo?',
			buttons: [
				{
					text: 'Eliminar',
					handler: () => {
						let conf2 = this.comun.alertCtrl.create({
							title: 'Cuidado',
							message: 'Dejaras de recibir beneficios de la comunidad de tu amigo',
							buttons: [
								{
									text: 'Eliminar',
									handler: () => {
										this.listaReferencias[key].off()
										delete this.listaKeyAmigos[key]
										this.listaAmigos = _.values(this.listaKeyAmigos)
										this.userBack.borrarAmigo(key)
									}
								},
								{
									text: 'Cancelar',
									handler: () => {

									}
								}
							]
						})
						conf2.present()
					}
				},
				{
					text: 'Cancelar',
					handler: () => {

					}
				}
			]
		})
		confirm.present();
	}

}
