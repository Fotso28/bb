import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListRavitaillementPageRoutingModule } from './list-ravitaillement-routing.module';

import { ListRavitaillementPage } from './list-ravitaillement.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, PipeModule,
    IonicModule, ComponentsModule,
    ListRavitaillementPageRoutingModule
  ],
  declarations: [ListRavitaillementPage]
})
export class ListRavitaillementPageModule {}
