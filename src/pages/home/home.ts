import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PrincipalPage } from '../principal/principal'
import { RestaurantesPage } from '../restaurantes/restaurantes'

/*
  Generated class for the Home tabs.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  tab1Root: any ;
  tab2Root: any ;
  titulo: string;

  constructor(public navCtrl: NavController) {
    this.tab1Root = PrincipalPage;
    this.tab2Root = RestaurantesPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad homeeeeeeeeeeeeeeeeeeeeee');
  }

}