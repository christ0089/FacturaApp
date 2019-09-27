import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: TabsPage,
        children: [
          {path: '', loadChildren: '../home/home.module#HomePageModule' },
          {path: 'home', loadChildren: '../home/home.module#HomePageModule'},
          {path: 'station-scan', loadChildren: '../station-scan/station-scan.module#StationScanPageModule'},
        ]
      },
    ])
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
