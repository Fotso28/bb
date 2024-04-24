import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvarisPage } from './avaris.page';

const routes: Routes = [
  {
    path: '',
    component: AvarisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvarisPageRoutingModule {}
