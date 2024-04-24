import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddUpdateCategoriePage } from './add-update-categorie.page';

const routes: Routes = [
  {
    path: '',
    component: AddUpdateCategoriePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddUpdateCategoriePageRoutingModule {}
