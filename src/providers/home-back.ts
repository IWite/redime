// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { DatosUsuario } from '../interfaces'
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

	borrarReferenciaHijo(id:string){
		this.refUsuarios.child(id).transaction((data:DatosUsuario)=>{
			if(data){
				data.padre = null
			}
			return data
		})
	}

	guardarAmigos(id:string,hijos:Object){
		this.refUsuarios.child(id+'/hijos').update(hijos)
	}

}
