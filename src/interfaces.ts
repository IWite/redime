// -----------------------------------------------------------------
// Usuario
// -----------------------------------------------------------------

export interface DatosUsuario {
	cod_usr?: string,
	hijos?: Object
	padre: string,
	foto?: string,
	nombre: string
	infoPuntos: infoPuntos,
	numAmigos?: number
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
	porcentajeBase: number, // porcentaje ganancia base del usuario
	porcentajeRed: number, // Porcentaje para la red y el restante para redime
	porcentajeCompra: number, // Porcentaje de compra del usuario en el restaurante
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
