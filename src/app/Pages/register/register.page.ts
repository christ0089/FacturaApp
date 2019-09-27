import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { RFC, IRFC } from 'src/app/Models/rfc';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { RfcsService } from 'src/app/Services/rfcs.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

declare var google;

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public register: FormGroup;
  autocompleteItems;
  rfcModel = new RFC();
  service = new google.maps.places.AutocompleteService();
  editMode = false;
  constructor(
    public formBuilder: FormBuilder,
    public database: AngularFirestore,
    public storage: Storage,
    private navParams: ActivatedRoute,
    private navCtrl: NavController,
    private rfc: RfcsService,
    private barcode: BarcodeScanner,
    private zone: NgZone,
  ) {

    this.autocompleteItems = [];

    this.register = this.formBuilder.group({
      rfc: [
        '',
        [
          Validators.required,
          Validators.pattern(/^([A-ZÑ&]{3,4}) ?(?:- ?)?(\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])) ?(?:- ?)?([A-Z\d]{2})([A\d])$/)
        ]
      ],
      razonSocial: [''],
      name: [''],
      location: [''],
      zip: [''],
      receiver: ['', Validators.email],
    });

  }

  ngOnInit() {

  }

  ionViewDidEnter() {
    const data: string = this.navParams.snapshot.paramMap.get('rfc');
    if (data != null) {
      this.rfc.rfcData(data).then(rfcData => {
        if (rfcData == null) {
          this.navCtrl.back();
        }
        this.parseDataToRfcForm(rfcData);
      });
    }
  }

  parseDataToRfcForm(rfcData) {
    console.log(rfcData);
    this.rfcModel = rfcData as RFC;
    this.editMode = true;
    this.register.get('rfc').setValue(rfcData.rfc);
    this.register.get('name').setValue(rfcData.name);
    this.register.get('razonSocial').setValue(rfcData.razonSocial);
    if (rfcData.address != null) {
      this.register.get('location').setValue(`${rfcData.address.street}, ${rfcData.address.colonia}, ${rfcData.address.state}`);
      this.register.get('zip').setValue(rfcData.address.zip);
    }
    this.register.get('receiver').setValue(rfcData.receiver);
  }

  delete() {
    this.rfc.delete(this.rfcModel.rfc).then(() => {
      this.navCtrl.back();
    });
  }

  registerRFC() {
    if (this.register.valid === true) {
      this.rfcModel.razonSocial = this.register.get('razonSocial').value;
      this.rfcModel.rfc = this.register.get('rfc').value;
      this.rfcModel.name = this.register.get('name').value;
      this.rfcModel.receiver = this.register.get('receiver').value;
      this.rfc.addRFC(this.rfcModel).then(() => {
        this.navCtrl.back();
      });
    } else {
      console.log('Not Valid');
    }
  }

  updateSearch() {
    const val = this.register.get('location').value;
    if (val === '') {
      this.autocompleteItems = [];
      return;
    }

    let me = this;
    this.service.getPlacePredictions({
      input: val,
      componentRestrictions: {
        country: 'mx'
      }
    }, (predictions, status) => {
      me.autocompleteItems = [];

      me.zone.run(() => {
        if (predictions != null) {
          predictions.forEach((prediction) => {
            me.autocompleteItems.push(prediction.description);
          });
        }
      });
    });
  }

  /** Get Geo Code Address Components
  * @params - address
  *
  */
  async geoCode(address: any) {
    const tempModel = new RFC();
    const geocoder = new google.maps.Geocoder();
    this.register.get('location').setValue(address);
    await geocoder.geocode({ 'address': address }, (results, status) => {
      const locationComponents: any[] = results[0].address_components;
      tempModel.addAddresComponents(locationComponents);
      this.register.get('zip').setValue(tempModel.address.zip);
    });
    this.rfcModel.address = tempModel.address;
  }

  // Convert to GEO Code Components
  chooseItem(item: any) {
    this.geoCode(item);
    this.autocompleteItems = [];
  }

  dismiss() {
    if (this.register.get('location').value === '') {
      this.autocompleteItems = [];
    }
  }

  scanCodeV2() {
    this.barcode.scan({ formats: 'QR_CODE' }).then((data) => {
      const rfc = JSON.parse(data.text) as IRFC;
      if (rfc == null) {
        return;
      }
      this.parseDataToRfcForm(rfc);
    });
  }
}
