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
// -----------------------------------------------------------------
// Providers
// -----------------------------------------------------------------
import { FirebaseService } from '../providers/firebase-service'
import { ComunService } from '../providers/comun-service'
import { UserBack } from '../providers/user-back'

// -----------------------------------------------------------------
// Extra
// -----------------------------------------------------------------
import {CodigoComponent} from'../components/codigo/codigo'
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
    CreateCountPage
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
    CreateCountPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler }, FirebaseService, ComunService, UserBack]
})
export class AppModule { }
