// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';


@Injectable()
export class AmigosService {
	// -----------------------------------------------------------------
	// Atributos
	// -----------------------------------------------------------------

	// -----------------------------------------------------------------
	// Constructor
	// -----------------------------------------------------------------
	constructor() {
		console.log('Hello AmigosService Provider');
	}

	// -----------------------------------------------------------------
	// Metodos
	// -----------------------------------------------------------------


	validarCodigo(cod: string): Promise<any> {
		return new Promise((data, err) => {
			firebase.database().ref('cod_usr').transaction(codigos => {
				if (codigos) {
					if (codigos[cod])
						data(codigos[cod])
					else
						err()
				}
				return codigos
			})
		})
	}


	verificacionPadreagregar(padre, key) {
		return new Promise((data, err) => {
			if (padre == '-')
				data()
			else if (padre == key)
				err()
			else {
				firebase.database().ref('usuarios').child(padre).child('padre').transaction(padre => {
					if (padre!=null) {
						this.verificacionPadreagregar(padre, key).then(
							data2 => data(),
							err2 => err()
						)
					}
					return padre
				})
			}
		})
	}

	agregarReferenciaPadre(hijo, padre) {
		return new Promise((data, err) => {
			firebase.database().ref('usuarios').child(hijo).child('padre').transaction(pad => {
				if (pad != null) {
					if (pad == '-') {
						pad = padre
						data()
					}
					else
						err()
				}
				return pad
			})
		})
	}

}
