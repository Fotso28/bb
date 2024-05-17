import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagesComponent } from './images/images.component';
import { TestComponent } from './test/test.component';
import { CustomInputComponent } from './custom-input/custom-input.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    IonicModule,
  ],
  declarations: [ImagesComponent, TestComponent, CustomInputComponent],
  exports: [ImagesComponent, TestComponent, CustomInputComponent],
})
export class ComponentsModule {}
