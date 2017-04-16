// -----------------------------------------------------------------
// Components
// -----------------------------------------------------------------
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
// -----------------------------------------------------------------
// Page
// -----------------------------------------------------------------
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { PrincipalPage } from '../pages/principal/principal';
import { RestaurantesPage } from '../pages/restaurantes/restaurantes';
import { HomePage } from '../pages/home/home';
import { HistorialPage } from '../pages/historial/historial';
import { CreateCountPage } from '../pages/create-count/create-count';
import { Amigos } from "../pages/amigos/amigos";
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { FirebaseService } from '../providers/firebase-service'
import { ComunService } from '../providers/comun-service'
import { UserBack } from '../providers/user-back'
// -----------------------------------------------------------------
// Libraries
// -----------------------------------------------------------------
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
// -----------------------------------------------------------------
// Extra
// -----------------------------------------------------------------
import {CodigoComponent} from'../components/codigo/codigo'
import { Avatar } from "../components/avatar/avatar";
import {QRCodeComponent} from 'ng2-qrcode'



@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    RegisterPage,
    PrincipalPage,
    RestaurantesPage,
    HomePage,
    QRCodeComponent,
    CodigoComponent,
    HistorialPage,
    CreateCountPage,
    Amigos,
    Avatar
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    RegisterPage,
    PrincipalPage,
    RestaurantesPage,
    HomePage,
    CodigoComponent,
    HistorialPage,
    CreateCountPage,
    Amigos
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, FirebaseService, ComunService, UserBack,BarcodeScanner]
})
export class AppModule { }
