import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RavitaillementFournisseurStepPageRoutingModule } from './ravitaillement-fournisseur-step-routing.module';

import { RavitaillementFournisseurStepPage } from './ravitaillement-fournisseur-step.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { DirectivesModule } from 'src/app/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, ComponentsModule,
    IonicModule, DirectivesModule,
    RavitaillementFournisseurStepPageRoutingModule
  ],
  declarations: [RavitaillementFournisseurStepPage]
})
export class RavitaillementFournisseurStepPageModule {}
