// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Subject } from 'rxjs/Subject';
import { DatosUsuario } from '../interfaces'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';



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
	constructor(public http: Http) {
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
	}

	/**
	 * Crea un usuario
	 * @param {Object} json Datos del usuario 
	 * @returns {Promise<null>} Respuesta del metodo
	 * @memberOf UserBack
	 */
	crearUsuario(json: Object): Promise<null> {
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
						let cod = 'usr:' + this.stringGen(tam)
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
		let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#-";
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
		this.refUsuario.child(this.user.uid + '/puntos').on('value', snap => {
			this.puntos.next(snap.val())
		})
	}

	darPuntosRed() {
		this.refUsuario.child(this.user.uid + '/puntosRed').on('value', snap => {
			this.puntosRed.next(snap.val())
		})
	}

	TieneHijo(cod: string):Promise<boolean> {
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

}



