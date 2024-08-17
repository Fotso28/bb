import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvarisPage } from './avaris.page';
import { ComponentsModule } from 'src/app/components/components.module';

const routes: Routes = [
  {
    path: '',
    component: AvarisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), ComponentsModule],
  exports: [RouterModule],
})
export class AvarisPageRoutingModule {}
