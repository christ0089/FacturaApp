import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonicStorageModule } from '@ionic/storage';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxQRCodeModule } from 'ngx-qrcode2';


import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { PostPictureService } from './Services/post-picture';
import { RfcsService } from './Services/rfcs.service';
import { ComponentsModule } from './Component/components.module';

const firebase = {
  apiKey: "AIzaSyDa8eHeCBrRxICg_HzEsOO7ULMhy79vPxY",
  authDomain: "facturaapp-e7560.firebaseapp.com",
  databaseURL: "https://facturaapp-e7560.firebaseio.com",
  projectId: "facturaapp-e7560",
  storageBucket: "facturaapp-e7560.appspot.com",
  messagingSenderId: "1035230305815",
  appId: "1:1035230305815:web:e8c979707bc73873"
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    AngularFireModule.initializeApp(firebase),
    IonicStorageModule.forRoot(),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ComponentsModule,
    AppRoutingModule],
  providers: [
    StatusBar,
    Camera,
    SplashScreen,
    NgxQRCodeModule,
    PostPictureService,
    BarcodeScanner,
    RfcsService,
    HttpClientModule,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
