// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';


@Component({
  selector: 'page-restaurantes',
  templateUrl: 'restaurantes.html'
})
export class RestaurantesPage {

  opt = {
    bordeColor: '1px solid #00e4a6',
		padding: '2px',
		size: '10vh',
		icon: 'md-restaurant',
		iconStyle: {
			"font-size": "8vh"
		}
  }

  wMap
  hMap = 180
  idr: string

  listaRestaurantes = []

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.wMap = window.innerWidth -32
    firebase.database().ref('restaurante').on('child_added',snap=>{
      this.listaRestaurantes.push(snap.val())
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantesPage');
  }

  abrir(idrest){
    
  }

}
