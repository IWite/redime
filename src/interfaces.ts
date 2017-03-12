// -----------------------------------------------------------------
// Usuario
// -----------------------------------------------------------------

export interface DatosUsuario {
	cod_usr?: string,
	fecha: string,
	hijos?: Object
	padre?: string,
	infoPuntos: infoPuntos
}

export interface infoPuntos {
	puntos: number,
	puntosRed: number,
	numAmigos: 5,
	consumo: number,
	historico?: HistoricoUsuario

}

export interface HistoricoUsuario {
	[index: string]: {
		tipo: string,
		restaurante: string
		valor: number,
		ganancia: number,
		fecha: string
	}

}

// -----------------------------------------------------------------
// Restaurante
// -----------------------------------------------------------------

export interface DatosRestaurante {
	pago: number
	historico?: HistoricoRestaurante
}

export interface HistoricoRestaurante {
	[index: string]: {
		compra: number,
		usuario: string,
		pagoRedime: number,
		fecha: string
	}
}

export interface PorceRestaurante {
	porcentajeBase: number,
	porcentajeRed: number,
	porcentajeCompra: number,
}


// -----------------------------------------------------------------
// Empresa
// -----------------------------------------------------------------
export interface Empresa {
	pago: number,
	historico: HistoricoEmpresa
}

export interface HistoricoEmpresa {
	[index: string]: {
		tipo: string,
		restaurante: string
		valor: number,
		ganancia: number,
		fecha: string
	}
}
