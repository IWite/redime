// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import * as firebase from 'firebase';


@Injectable()
export class UserBack {
  // -----------------------------------------------------------------
  // Atributos
  // -----------------------------------------------------------------

  user: firebase.User

  constructor(public http: Http) {
    console.log('Hello UserBack Provider');
  }

}
