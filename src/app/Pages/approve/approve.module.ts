import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ApprovePage } from './approve.page';
import { ComponentsModule } from 'src/app/Component/components.module';

const routes: Routes = [
  {
    path: '',
    component: ApprovePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ApprovePage]
})
export class ApprovePageModule {}
