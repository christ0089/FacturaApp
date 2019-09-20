import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FormBuilderComponent } from './form-builder/form-builder.component';

@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      IonicModule,
    ],
    declarations: [
        FormBuilderComponent
    ],
    exports: [
        FormBuilderComponent
    ]
  })
  export class ComponentsModule {}

  