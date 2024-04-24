import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RavitaillementEmballageStepPageRoutingModule } from './ravitaillement-emballage-step-routing.module';

import { RavitaillementEmballageStepPage } from './ravitaillement-emballage-step.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RavitaillementEmballageStepPageRoutingModule
  ],
  declarations: [RavitaillementEmballageStepPage]
})
export class RavitaillementEmballageStepPageModule {}
