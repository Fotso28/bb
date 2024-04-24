import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FamillePageRoutingModule } from './famille-routing.module';

import { FamillePage } from './famille.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    FamillePageRoutingModule
  ],
  declarations: [FamillePage]
})
export class FamillePageModule {}
