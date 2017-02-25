import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
/*
  Generated class for the Codigo component.

  See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
  for more info on Angular 2 Components.
*/
@Component({
  selector: 'codigo',
  templateUrl: 'codigo.html'
})
export class CodigoComponent {

  codigo: string

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.codigo = navParams.get('cod')
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
