import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProduitPageRoutingModule } from './add-produit-routing.module';

import { AddProduitPage } from './add-produit.page';
import { DirectivesModule } from 'src/app/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule, DirectivesModule,
    AddProduitPageRoutingModule
  ],
  declarations: [AddProduitPage]
})
export class AddProduitPageModule {}
