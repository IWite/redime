export interface DatosUsuario {
	cedula: string,
	cod_usr: string,
	fecha: string,
	puntos: number,
	puntosRed: number,
    numAmigos: number,
    hijos? : Object
    padre?: string,
	consumo? : number,
	historico?: Object
}

export interface DatosRestaurante{
	porBase:number,
	porRed:number,
	porcentaje:number,
	pago: number
	historico?: Object
}

export interface Empresa{
	pago:number,
	historico: Object
}

export interface HistoricoEmpresa{
	tipo: string,
	restaurante: string
	valor: number,
	ganancia: number,
	fecha:string
}

export interface HistoricoUsuario{
	tipo: string,
	restaurante: string
	valor: number,
	ganancia: number,
	fecha:string
}