export interface DatosUsuario {
	cedula: string,
	cod_usr: string,
	fecha: string,
	puntos: number,
	puntosRed: number,
    numAmigos: number,
    hijos? : Object
    padre?: string
}

