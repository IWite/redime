import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.wMap = window.innerWidth -32
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RestaurantesPage');
  }

  abrir(idrest){
    
  }

}
