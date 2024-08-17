
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RavitaillementConfirmationStepPageRoutingModule } from './ravitaillement-confirmation-step-routing.module';

import { RavitaillementConfirmationStepPage } from './ravitaillement-confirmation-step.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RavitaillementConfirmationStepPageRoutingModule
  ],
  declarations: [RavitaillementConfirmationStepPage]
})
export class RavitaillementConfirmationStepPageModule {}
