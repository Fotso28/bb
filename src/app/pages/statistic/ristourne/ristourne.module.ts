import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RistournePageRoutingModule } from './ristourne-routing.module';

import { RistournePage } from './ristourne.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, ComponentsModule,
    RistournePageRoutingModule
  ],
  declarations: [RistournePage]
})
export class RistournePageModule {}
