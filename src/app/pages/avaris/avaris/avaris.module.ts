import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvarisPageRoutingModule } from './avaris-routing.module';

import { AvarisPage } from './avaris.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvarisPageRoutingModule
  ],
  declarations: [AvarisPage]
})
export class AvarisPageModule {}
