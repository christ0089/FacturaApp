
import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController, LoadingController, Platform, ToastController } from '@ionic/angular';
import { PostPictureService } from '../../Services/post-picture';
import { Storage } from '@ionic/storage';
import { IRFC } from 'src/app/Models/rfc';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, filter, switchMap } from 'rxjs/operators';
import { IonSlides } from '@ionic/angular';
import { FadeAnimation } from 'src/app/Animations/fadeAnim';
import { RfcsService } from 'src/app/Services/rfcs.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { load } from '@angular/core/src/render3';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  animations: [
    FadeAnimation.fadeInMS(300)
  ]
})
export class HomePage {

  histFactura$: Observable<IRFC[]>;
  result$: Observable<any>;
  currRFC$: BehaviorSubject<string | null>;

  sliderConfig = {
    slidesPerView: 1.6,
    spaceBetween: 10,
    centeredSlides: true
  };
  @ViewChild('slides') slides: IonSlides;

  constructor(
    public http: HttpClient,
    public navCtrl: NavController,
    public storage: Storage,
    public firestore: AngularFirestore,
    public camera: PostPictureService,
    private barcodeScanner: BarcodeScanner,
    private rfcs: RfcsService,
    private snackBar: ToastController,
    private platform: Platform,
    private loadingCtrl: LoadingController
  ) {
    this.currRFC$ = new BehaviorSubject(null);
    this.histFactura$ = this.currRFC$.pipe(switchMap((rfc: string) => {
      return this.firestore.collection<IRFC>('Facturas', ref => ref.where('rfc', '==', rfc)).valueChanges();
    }));
  }

  addRFC($event) {
    this.navCtrl.navigateForward('/register');
  }

  openEditMode(rfc) {
    this.navCtrl.navigateForward(`/register/${rfc}`);
  }

  ionViewDidEnter() {
    this.platform.ready().then((readySource) => {
      if (this.platform.width() < '400') {
        this.sliderConfig.spaceBetween =  2.5;
        this.sliderConfig.slidesPerView = 1.2;
      }
      console.log('Width: ' + this.platform.width());
      console.log('Height: ' + this.platform.height());
    });
  }

  slideChanged() {
    this.slides.getActiveIndex().then(index => {
      this.currRFC$.next(this.rfcs.rfcArr[index].rfc);
    });
  }

  scanCodeV2(rfcEncoded: string) {
    this.barcodeScanner.scan({formats: 'QR_CODE'}).then((data) => {
      const doc = this.firestore.createId();
      const rfc = JSON.parse(rfcEncoded) as IRFC;
      this.firestore.collection('QR_Preprocessing').doc(doc).set(data.text);
      this.navCtrl.navigateForward(`/approve/${doc}/${rfc.rfc}`);
    }).catch(e => {
      this.snackBar.create({
        message: e,
        color: "warning",
        duration: 1000000
      }).then((data) => {
        data.present();
      });
    });
  }

  uploadImage(rfc: IRFC) {
    this.camera.openGallery().then(async (url) => {
      const docId = this.firestore.createId();
      const loading = await this.loadingCtrl.create();
      loading.present();
      const cameraUpload = this.camera.postPicture(url, '', docId);
      Promise.resolve(cameraUpload).then(() => {
        this.loadingCtrl.dismiss();
        this.navCtrl.navigateForward(`/approve/${docId}/${rfc.rfc}`).catch(e => {
          this.snackBar.create({
            message: e,
            color: "light",
            duration: 2000
          }).then((data) => {
            data.present();
          });
          console.error(e);
        });
      }).catch(e => {
        this.snackBar.create({
          message: e,
          color: "warning",
          duration: 100000
        }).then((data) => {
          data.present();
        });
      });
    });
  }

  async onSubmit() {
    console.log("Making Request");
    const url = "https://us-central1-facturaapp-e7560.cloudfunctions.net/getFactura";
    await this.http.get(url, {
      params: {
        password: "123",
        rfc: "1223"
      }
    }).toPromise().then(() => {
      console.log("Finished Request");
    });
  }
}
