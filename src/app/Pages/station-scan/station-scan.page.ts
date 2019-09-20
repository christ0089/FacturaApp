import { Component, ViewChild } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IRFC, RFC } from 'src/app/Models/rfc';
import { AngularFirestore } from '@angular/fire/firestore';
import { Storage } from '@ionic/storage';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionService } from 'src/app/Services/question.service';
import { filter, tap, take } from 'rxjs/operators';
import { LoadingController, ToastController, NavController, IonSlides } from '@ionic/angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { PostPictureService } from 'src/app/Services/post-picture';
import { RfcsService } from 'src/app/Services/rfcs.service';
import { ActivatedRoute } from '@angular/router';
import { FadeAnimation } from 'src/app/Animations/fadeAnim';

@Component({
  selector: 'app-station-scan',
  templateUrl: './station-scan.page.html',
  styleUrls: ['./station-scan.page.scss'],
  animations: [
    FadeAnimation.fadeInMS(2)
  ]
})
export class StationScanPage {
  rfcScan = null;
  clientRFC: IRFC = null;
  docId: string = null;
  rfc: IRFC = null;
  @ViewChild('slides') slides: IonSlides;

  constructor(
    private barcode: BarcodeScanner,
    public firestore: AngularFirestore,
    public loadingCtrl: LoadingController,
    public activeRoute: ActivatedRoute,
    public camera: PostPictureService,
    public snackBar: ToastController,
    public navCtrl: NavController,
    public rfcService: RfcsService,
    public questionService: QuestionService,
  ) {
  }

  ngOnInit() {
    if (this.rfcService.rfcArr.length === 0) {
      this.snackBar.create({
        message: 'Porfavor la empresa agrega en el menu de inicio.',
        duration: 2000
      }).then((toast) => {
        toast.present();
      });
    }
  }

  slideChanged() {
    this.slides.getActiveIndex().then(index => {
      this.rfc = this.rfcService.rfcArr[index];
    });
  }


  finished($event) {

  }

  scanCodeV2() {
    this.barcode.scan({ formats: 'QR_CODE' }).then((data) => {
      this.clientRFC = JSON.parse(data.text) as IRFC;
      if (this.rfcScan == null) {
        return;
      }
    });
  }

  uploadImage() {
    if (this.clientRFC === null) {
      this.snackBar.create({
        message: "Favor de Agregar al cliente primero",
        color: "warning",
        duration: 2000
      }).then((data) => {
        data.present();
      });
      return;
    }
    this.camera.openGallery().then(async (url) => {
      this.docId = this.firestore.createId();
      const loading = await this.loadingCtrl.create();
      loading.present();
      const cameraUpload = this.camera.postPicture(url, '', this.docId);
      Promise.resolve(cameraUpload).then(() => {
        this.loadingCtrl.dismiss();
      }).catch(e => {
        this.snackBar.create({
          message: e,
          color: "warning",
          duration: 2000
        }).then((data) => {
          data.present();
        });
      });
    });
  }

}
