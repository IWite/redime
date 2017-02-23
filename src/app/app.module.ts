// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
// -----------------------------------------------------------------
// Page
// -----------------------------------------------------------------
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { PrincipalPage,Codigo } from '../pages/principal/principal';
import { RestaurantesPage } from '../pages/restaurantes/restaurantes';
import { HomePage } from '../pages/home/home'
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { FirebaseService } from '../providers/firebase-service'
import { ComunService } from '../providers/comun-service'
import { UserBack } from '../providers/user-back'

import {QRCodeComponent} from 'ng2-qrcode'


@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    RegisterPage,
    PrincipalPage,
    Codigo,
    RestaurantesPage,
    HomePage,
    QRCodeComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    RegisterPage,
    PrincipalPage,
    Codigo,
    RestaurantesPage,
    HomePage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, FirebaseService, ComunService, UserBack]
})
export class AppModule { }
