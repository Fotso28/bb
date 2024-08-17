import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdateAvarisPageRoutingModule } from './add-update-avaris-routing.module';

import { AddUpdateAvarisPage } from './add-update-avaris.page';
import { DirectivesModule } from 'src/app/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule, DirectivesModule,
    AddUpdateAvarisPageRoutingModule
  ],
  declarations: [AddUpdateAvarisPage]
})
export class AddUpdateAvarisPageModule {}
