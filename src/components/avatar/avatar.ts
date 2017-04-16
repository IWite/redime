import { Component, Input ,ViewChild, ElementRef, AfterViewInit} from '@angular/core';

/**
 * Generated class for the Avatar component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'avatar',
  templateUrl: 'avatar.html'
})
export class Avatar implements AfterViewInit{

  // -----------------------------------------------------------------
  // Atributos
  // -----------------------------------------------------------------
  
  @Input()
  opciones: opciones

  @Input()
  srcImage: string

  @ViewChild('marco')
  marco: ElementRef

  constructor() {
    console.log('Hello Avatar Component');
  }

  ngAfterViewInit(){
    let elemet = (<HTMLElement>this.marco.nativeElement)
    
    elemet.style.border = this.opciones.bordeColor
    elemet.style.padding = this.opciones.padding
    elemet.style.height = this.opciones.size
    elemet.style.width = this.opciones.size
  }

}

interface opciones{
  bordeColor: string,
  padding: string,
  size: string,
  icon: string,
  iconStyle: string
}
