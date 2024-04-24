import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdateFamillePageRoutingModule } from './add-update-famille-routing.module';

import { AddUpdateFamillePage } from './add-update-famille.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    AddUpdateFamillePageRoutingModule
  ],
  declarations: [AddUpdateFamillePage]
})
export class AddUpdateFamillePageModule {}
