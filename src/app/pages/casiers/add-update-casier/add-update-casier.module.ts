import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddUpdateCasierPageRoutingModule } from './add-update-casier-routing.module';

import { AddUpdateCasierPage } from './add-update-casier.page';
import { DirectivesModule } from 'src/app/directive/directives.module';

@NgModule({
  imports: [
    CommonModule,DirectivesModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
    AddUpdateCasierPageRoutingModule
  ],
  declarations: [AddUpdateCasierPage]
})
export class AddUpdateCasierPageModule {}
