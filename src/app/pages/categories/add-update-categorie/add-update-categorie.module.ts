import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdateCategoriePageRoutingModule } from './add-update-categorie-routing.module';

import { AddUpdateCategoriePage } from './add-update-categorie.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    AddUpdateCategoriePageRoutingModule
  ],
  declarations: [AddUpdateCategoriePage]
})
export class AddUpdateCategoriePageModule {}
