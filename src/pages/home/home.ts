// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { RestaurantesPage } from '../restaurantes/restaurantes'
// -----------------------------------------------------------------
// Pages
// -----------------------------------------------------------------
import {HomeBack} from '../../providers/home-back'
import {UserBack} from '../../providers/user-back'
import { PrincipalPage } from '../principal/principal'
import { Amigos } from "../amigos/amigos";
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [HomeBack]
})
export class HomePage {
  // -----------------------------------------------------------------
  // Atributos
  // -----------------------------------------------------------------
  tab1Root: any ;
  tab2Root: any ;
  tab3Root: any
  titulo: string;

  constructor(public navCtrl: NavController, private homBack:HomeBack, private userbac: UserBack) {
    this.tab1Root = PrincipalPage;
    this.tab2Root = Amigos;
    this.tab3Root = RestaurantesPage
  }

  ionViewDidLoad() {
  }

  openModal(){
    firebase.database().ref('porceRestaurantes/r1').once('value',snap=>{
      let datos = snap.val()
      this.homBack.agregarCompra(10000,datos,this.userbac.datosUsuatio.padre,'r1')
    })
    
  }
}