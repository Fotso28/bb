import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddInventoryPageRoutingModule } from './add-inventory-routing.module';

import { AddInventoryPage } from './add-inventory.page';
import { CustomInputComponent } from 'src/app/components/custom-input/custom-input.component';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule, ComponentsModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    AddInventoryPageRoutingModule,
  ],
  declarations: [AddInventoryPage]
})
export class AddInventoryPageModule {}
