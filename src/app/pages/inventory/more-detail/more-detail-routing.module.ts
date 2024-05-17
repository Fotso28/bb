import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoreDetailPage } from './more-detail.page';

const routes: Routes = [
  {
    path: '',
    component: MoreDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoreDetailPageRoutingModule {}
