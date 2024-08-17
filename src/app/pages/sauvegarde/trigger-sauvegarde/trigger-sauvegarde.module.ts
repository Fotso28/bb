import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TriggerSauvegardePageRoutingModule } from './trigger-sauvegarde-routing.module';

import { TriggerSauvegardePage } from './trigger-sauvegarde.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TriggerSauvegardePageRoutingModule
  ],
  declarations: [TriggerSauvegardePage]
})
export class TriggerSauvegardePageModule {}
