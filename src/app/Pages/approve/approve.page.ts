import { Component, OnInit } from '@angular/core';
import { StationScanPage } from '../station-scan/station-scan.page';
import { IRFC } from 'src/app/Models/rfc';

@Component({
  selector: 'app-approve',
  templateUrl: './approve.page.html',
  styleUrls: ['./approve.page.scss'],
  
})
export class ApprovePage extends StationScanPage implements OnInit {


  ngOnInit() {
    this.docId = this.activeRoute.snapshot.paramMap.get('docId');
    const tempRfc = this.activeRoute.snapshot.paramMap.get('rfc');
    this.rfcService.rfcData(tempRfc).then((rfc: IRFC) => {
        this.rfc = rfc;
    });
  }

  finished() {
    this.navCtrl.back();
  }

}
