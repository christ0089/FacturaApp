import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IRFC } from '../Models/rfc';

@Injectable({
  providedIn: 'root'
})
export class RfcsService {

  private exampleRFC: IRFC = {
    rfc: 'EJE001234567',
    name: 'Ejemplo - Contaduria',
    razonSocial : 'Ejemplo',
    receiver : 'demo@ejemplo.com',
  };

  private rfcs = [

  ];

  encodedRFC = [

  ];

  constructor(private storage: Storage) {
    this.load();
  }

  load() {
    this.rfcs.push(this.exampleRFC);
    this.encodedRFC.push(JSON.stringify(this.exampleRFC));
    this.storage.keys().then(keys => {
      keys.map(key => {
        if (key === 'hasSeenTutorial') {
          return;
        }
        this.storage.get(key).then((data: IRFC) => {
          this.encodedRFC.push(JSON.stringify(data));
          this.rfcs.push(data);
        });
      });
    });
  }

  delete(rfc) {
    return this.storage.remove(rfc).then(() => {
      this.rfcs = [];
      this.load();
    });
  }

  async addRFC(rfcModel: IRFC) {
    this.rfcs = [];
    return this.storage.set(rfcModel.rfc, rfcModel).then(() => {
      this.load();
    });
  }

  async rfcData(rfc): Promise<IRFC> {
    if (this.rfcs.length === 0) {
      await this.load();
    }
    const index = this.rfcs.findIndex((v) => {
      return v.rfc === rfc;
    });
    return this.rfcs[index];
  }

  get rfcArr() {
    return this.rfcs;
  }
}
