import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListInventoryPageRoutingModule } from './list-inventory-routing.module';

import { ListInventoryPage } from './list-inventory.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListInventoryPageRoutingModule
  ],
  declarations: [ListInventoryPage]
})
export class ListInventoryPageModule {}
