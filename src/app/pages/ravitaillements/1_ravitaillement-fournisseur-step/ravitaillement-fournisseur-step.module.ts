import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RavitaillementFournisseurStepPageRoutingModule } from './ravitaillement-fournisseur-step-routing.module';

import { RavitaillementFournisseurStepPage } from './ravitaillement-fournisseur-step.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    RavitaillementFournisseurStepPageRoutingModule
  ],
  declarations: [RavitaillementFournisseurStepPage]
})
export class RavitaillementFournisseurStepPageModule {}
