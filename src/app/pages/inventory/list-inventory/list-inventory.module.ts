import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListInventoryPageRoutingModule } from './list-inventory-routing.module';

import { ListInventoryPage } from './list-inventory.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipeModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, PipeModule,
    IonicModule, ComponentsModule,
    ListInventoryPageRoutingModule
  ],
  declarations: [ListInventoryPage]
})
export class ListInventoryPageModule {}
