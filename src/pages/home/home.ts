import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PrincipalPage } from '../principal/principal'
import { RestaurantesPage } from '../restaurantes/restaurantes'

import {HomeBack} from '../../providers/home-back'
import {UserBack} from '../../providers/user-back'

import * as firebase from 'firebase';

/*
  Generated class for the Home tabs.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HomeBack]
})
export class HomePage {

  tab1Root: any ;
  tab2Root: any ;
  titulo: string;

  constructor(public navCtrl: NavController, private homBack:HomeBack, private userbac: UserBack) {
    this.tab1Root = PrincipalPage;
    this.tab2Root = RestaurantesPage;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad homeeeeeeeeeeeeeeeeeeeeee');
  }

  openModal(){
    firebase.database().ref('porceRestaurantes/r1').once('value',snap=>{
      let datos = snap.val()
      this.homBack.agregarCompra(10000,datos,this.userbac.datosUsuatio.padre,'r1')
    })
    
  }
}