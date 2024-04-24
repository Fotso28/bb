import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RavitaillementProduitStepPageRoutingModule } from './ravitaillement-produit-step-routing.module';

import { RavitaillementProduitStepPage } from './ravitaillement-produit-step.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RavitaillementProduitStepPageRoutingModule
  ],
  declarations: [RavitaillementProduitStepPage]
})
export class RavitaillementProduitStepPageModule {}
