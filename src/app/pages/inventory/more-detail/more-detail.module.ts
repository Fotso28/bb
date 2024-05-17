import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoreDetailPageRoutingModule } from './more-detail-routing.module';

import { MoreDetailPage } from './more-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    MoreDetailPageRoutingModule
  ],
  declarations: [MoreDetailPage]
})
export class MoreDetailPageModule {}
