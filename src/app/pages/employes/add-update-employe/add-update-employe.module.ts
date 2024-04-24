import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdateEmployePageRoutingModule } from './add-update-employe-routing.module';

import { AddUpdateEmployePage } from './add-update-employe.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,ReactiveFormsModule,
    IonicModule,
    AddUpdateEmployePageRoutingModule,
    ComponentsModule
  ],
  declarations: [AddUpdateEmployePage]
})
export class AddUpdateEmployePageModule {}
