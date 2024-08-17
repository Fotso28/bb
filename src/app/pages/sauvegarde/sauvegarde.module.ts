import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SauvegardePageRoutingModule } from './sauvegarde-routing.module';

import { SauvegardePage } from './sauvegarde.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SauvegardePageRoutingModule
  ],
  declarations: [SauvegardePage]
})
export class SauvegardePageModule {}
