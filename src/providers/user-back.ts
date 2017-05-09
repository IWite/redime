// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { DatosUsuario, infoPuntos } from '../interfaces'
import { Loading } from 'ionic-angular';
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';
import { Geolocation } from '@ionic-native/geolocation';



@Injectable()
export class UserBack {

	// -----------------------------------------------------------------
	// Referencias
	// -----------------------------------------------------------------
	refUsuario: firebase.database.Reference

	// -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	user: firebase.User

	datosUsuatio: DatosUsuario

	listaKeyAmigos = []

	listaKeyRes = []

	load: Loading
	// -----------------------------------------------------------------
	// Observadores
	// -----------------------------------------------------------------
	private puntos = new Subject<number>()
	puntosObserv = this.puntos.asObservable()

	private puntosRed = new Subject<number>()
	puntosRedObserv = this.puntosRed.asObservable()

	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(private geolocation: Geolocation) {
		console.log('Hello UserBack Provider');
	}

	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------

	/**
	 * Inicializa servicio
	 * @param {firebase.User} pUser
	 * @memberOf UserBack
	 */
	iniciar(pUser: firebase.User) {
		this.user = pUser
		this.refUsuario = firebase.database().ref('usuarios/')
		this.cargarDatosUsuario()
		this.keyRest()
	}

	keyRest(){
		firebase.database().ref('cod_res').on('value',snap=>{
			this.listaKeyRes = snap.val()
		})
	}

	/**
	 * Crea un usuario
	 * @param {DatosUsuario} json Datos del usuario 
	 * @returns {Promise<null>} Respuesta del metodo
	 * @memberOf UserBack
	 */
	crearUsuario(json: DatosUsuario): Promise<null> {
		return new Promise(data => {
			this.generarCod(this.user.uid).then((cod) => {
				json['cod_usr'] = cod
				this.refUsuario.child(this.user.uid).set(json)
				data()
			})
		})

	}

	/**
	 * Generar código a un usuario
	 * @param {string} uid ID del usuario
	 * @returns {Promise<string>} código generado
	 * @memberOf UserBack
	 */
	generarCod(uid: string): Promise<string> {
		return new Promise(data => {
			let codigo = ''
			firebase.database().ref('cod_usr/').transaction(data => {
				if (data) {
					let cent = true
					let tam = 5
					let cont = 10
					while (cent) {
						tam = (cont == 0) ? tam + 1 : tam
						let cod = this.stringGen(tam)
						if (!data[cod]) {
							codigo = cod
							data[cod] = uid
							data['total']++
							cent = false
						}
						cont--
					}
				}
				return data
			}, (a, b, c) => {
				data(codigo)
			})
		})
	}

	/**
	 * Genera ramdom string
	 * @param {number} len tamaño del estring
	 * @returns {string} string tamaño len
	 * @memberOf UserBack
	 */
	stringGen(len: number): string {
		let text = "";
		let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
		for (let i = 0; i < len; i++)
			text += charset.charAt(Math.floor(Math.random() * charset.length));
		return text;
	}

	/**
	 * Carga los datos de un usuario
	 * @memberOf UserBack
	 */
	cargarDatosUsuario() {
		this.refUsuario.child(this.user.uid).on('value', (snap) => {
			this.datosUsuatio = <DatosUsuario>snap.val()
		})
	}

	darPuntos() {
		this.refUsuario.child(this.user.uid + '/infoPuntos/puntos').on('value', snap => {
			this.puntos.next(snap.val())
		})
	}

	darPuntosRed() {
		this.refUsuario.child(this.user.uid + '/infoPuntos/puntosRed').on('value', snap => {
			this.puntosRed.next(snap.val())
		})
	}

	TieneHijo(cod: string): Promise<boolean> {
		return new Promise(dat => {
			firebase.database().ref('cod_usr/' + cod).once('value', snap => {
				let obj = snap.val()
				if (!obj)
					dat(false)
				else if (this.datosUsuatio.hijos[obj])
					dat(true)
				else
					dat(false)
			})
		})
	}

	canjearPunto(): Promise<string> {
		return new Promise(data => {
			let estado = ''
			this.refUsuario.child(this.user.uid + '/infoPuntos').transaction((data: infoPuntos) => {
				if (data) {
					if (data.puntosRed == 0)
						estado = 'No tienes puntos de tu red'
					else if (data.consumo >= data.puntosRed) {
						estado = 'Se agregaron ' + data.puntosRed + ' puntos de tu red a tus puntos'
						data.consumo -= data.puntosRed
						data.puntos += data.puntosRed
						data.puntosRed = 0
					}
					else {
						let ppunto = data.puntosRed - (data.puntosRed - data.consumo )
						estado = 'Tu consumo actual es de ' + data.consumo + ', se han agregado ' + ppunto + ' puntos de tu red a tus puntos'
						data.consumo -= ppunto
						data.puntos += ppunto
						data.puntosRed -= ppunto
					}
				}
				return data
			}, (a, b, c) => {
				data(estado)
			})
		})
	}

	borrarAmigo(key: string){
		firebase.database().ref('usuarios/'+this.user.uid+'/hijos/'+key).remove()
		firebase.database().ref('usuarios/'+key+'/padre').transaction((data)=>{
			if(data){
				data = ''
			}
			return data
		})
	}


}



