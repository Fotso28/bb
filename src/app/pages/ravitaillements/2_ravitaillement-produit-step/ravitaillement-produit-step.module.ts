import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RavitaillementProduitStepPageRoutingModule } from './ravitaillement-produit-step-routing.module';

import { RavitaillementProduitStepPage } from './ravitaillement-produit-step.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RavitaillementProduitStepPageRoutingModule, ComponentsModule
  ],
  declarations: [RavitaillementProduitStepPage]
})
export class RavitaillementProduitStepPageModule {}
