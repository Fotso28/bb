import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListInventoryPage } from './list-inventory.page';

const routes: Routes = [
  {
    path: '',
    component: ListInventoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListInventoryPageRoutingModule {}
