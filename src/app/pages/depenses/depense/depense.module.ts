import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DepensePageRoutingModule } from './depense-routing.module';

import { DepensePage } from './depense.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DepensePageRoutingModule
  ],
  declarations: [DepensePage]
})
export class DepensePageModule {}
