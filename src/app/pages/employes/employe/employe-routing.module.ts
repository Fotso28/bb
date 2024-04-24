import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployePage } from './employe.page';

const routes: Routes = [
  {
    path: '',
    component: EmployePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployePageRoutingModule {}
