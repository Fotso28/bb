import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdateDepensePageRoutingModule } from './add-update-depense-routing.module';

import { AddUpdateDepensePage } from './add-update-depense.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    AddUpdateDepensePageRoutingModule
  ],
  declarations: [AddUpdateDepensePage]
})
export class AddUpdateDepensePageModule {}
