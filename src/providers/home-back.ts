// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatosUsuario, DatosRestaurante ,HistoricoEmpresa, Empresa, HistoricoUsuario} from '../interfaces'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';
// -----------------------------------------------------------------
// Constantes
// -----------------------------------------------------------------


@Injectable()
export class HomeBack {

	// -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	db: firebase.database.Database

	refCodigos = firebase.database().ref('cod_usr')
	refUsuarios = firebase.database().ref('usuarios')

	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor(public http: Http) {
		console.log('Hello HomeBack Provider');
		this.db = firebase.database()
	}

	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------

	formatDollar(num) {
		var p = num.toFixed(2).split(".");
		return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
			return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
		}, "") + "." + p[1];
	}

	agregarAmigo(cod: string, uid: string): Promise<string> {
		return new Promise((ok, err) => {
			this.refCodigos.child(cod).once('value', snap => {
				let idUs = snap.val()
				if (!idUs)
					err('Código no valido')
				else {
					let cond
					this.refUsuarios.child(idUs).transaction(
						(datos: DatosUsuario) => {
							if (datos) {
								if (datos.padre)
									cond = 0
								else {
									datos.padre = uid
									cond = 1
								}
							}
							return datos
						},
						(a, b, c) => {
							if (cond == 0)
								err('El usuario ya tiene un padre')
							else
								ok(idUs)
						})
				}
			})
		})
	}

	borrarReferenciaHijo(id: string) {
		this.refUsuarios.child(id).transaction((data: DatosUsuario) => {
			if (data) {
				data.padre = null
			}
			return data
		})
	}

	guardarAmigos(id: string, hijos: Object) {
		this.refUsuarios.child(id + '/hijos').update(hijos)
	}

	agregarCompra(valor, rest: DatosRestaurante, padre: string, nombreRestaurante:string) {
		
		let precioBase = valor * rest.porcentaje

		let valorUsuario = precioBase * rest.porRed

		let gananciaEmpresa = precioBase - valorUsuario

		let gananciaBase = valorUsuario * rest.porBase

		let donacionRed = valorUsuario - gananciaBase
		
		let user = firebase.auth().currentUser;

		let date = new Date()

		let fech = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds()

		let fecha = date.getTime()

		// -----------------------------------------------------------------
		// Actualizacion usuario
		// -----------------------------------------------------------------
		firebase.database().ref('usuarios/'+user.uid).transaction((data:DatosUsuario)=>{
			if(data){
				data.puntos += gananciaBase
				data.consumo += valor
				if(!data.historico)
					data.historico = {}
				let his:HistoricoUsuario ={
					tipo: 'CONSUMO',
					fecha: fech,
					ganancia: gananciaBase,
					restaurante:nombreRestaurante,
					valor: valor
				}
				data.historico[fecha] = his
			}
			return data
		})

		// -----------------------------------------------------------------
		// Actualizacion restaurranro
		// -----------------------------------------------------------------
		firebase.database().ref('restaurante/'+nombreRestaurante).transaction((dat:DatosRestaurante)=>{
			if(dat){
				if(!dat.historico)
					dat.historico = {}
				dat.historico[fecha] = {
					compra: valor,
					usuario: user.uid,
					pagoRedime: precioBase,
					fecha: fech
				}
				dat.pago += precioBase
			}
			return dat
		})

		// -----------------------------------------------------------------
		// Actualizacion empresa
		// -----------------------------------------------------------------
		firebase.database().ref('empresa').transaction((data: Empresa)=>{
			if(data){
				if(!data.historico)
					data.historico = {}
				let his: HistoricoEmpresa = {
					restaurante : nombreRestaurante,
					tipo : 'COBRO',
					valor: precioBase,
					ganancia: gananciaEmpresa,
					fecha: fech
				}
				data.historico[fecha]  = his
				data.pago += gananciaEmpresa
			}	
			return data
		})

		if (padre)
			this.puntosRed(donacionRed, padre)

	}

	puntosRed(puntos: number, id: string) {
		return new Promise(data => {
			let nPuntos = puntos * 0.5
			let cond = false
			let npadre = ''
			firebase.database().ref('usuarios/' + id).transaction(
				(data:DatosUsuario) => {
					if (data) {
						data.puntosRed += nPuntos
						if(data.padre){
							cond = true
							npadre = data.padre
						}
					}
					return data
				},
				(a,b,c)=>{
					if(cond)
						this.puntosRed(nPuntos,npadre).then(da=>{
							data()
						})
					else{
						data()
					}
				})
		})

	}



}
