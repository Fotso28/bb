import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RistournePage } from './ristourne.page';

const routes: Routes = [
  {
    path: '',
    component: RistournePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RistournePageRoutingModule {}
