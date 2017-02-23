// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------

// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import { QRCodeComponent } from 'ng2-qrcode'


@Component({
  selector: 'page-principal',
  templateUrl: 'principal.html',
})
export class PrincipalPage {

  puntos:string
  arbol:string

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController) {
    this.puntos = this.formatDollar(0)
    this.arbol = this.formatDollar(0)
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrincipalPage');
  }

  modal() {
    let modal = this.modalCtrl.create(Codigo, { cod: 'us:66o23' });
    modal.present();
  }

  formatDollar(num) {
    var p = num.toFixed(2).split(".");
    return p[0].split("").reverse().reduce(function (acc, num, i, orig) {
      return num == "-" ? acc : num + (i && !(i % 3) ? "," : "") + acc;
    }, "") + "." + p[1];
  }

}



@Component({
  template: `
<ion-header>
    <ion-toolbar color="redime_blu">
        <ion-title>
            Mi código
        </ion-title>
        <ion-buttons start>
            <button ion-button (click)="dismiss()">
                <ion-icon name="md-close"></ion-icon>
            </button>
        </ion-buttons>
    </ion-toolbar>
</ion-header>
<ion-content padding>

    <qrcode [qrdata]="codigo" [size]="100" [level]="'M'" usesvg=true></qrcode>
    <div style="text-align: center;font-size: 3em;position: absolute;width: 100%;bottom: 2vh;">
        <span>{{codigo}}</span>
    </div>
</ion-content>
`

})
export class Codigo {

  codigo: string

  constructor(public viewCtrl: ViewController, public navParams: NavParams) {
    this.codigo = navParams.get('cod')
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
