import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImagesComponent } from './images/images.component';
import { TestComponent } from './test/test.component';
import { CustomInputComponent } from './custom-input/custom-input.component';
import { PointVenteComponent } from './point-vente/point-vente.component';
import { DirectivesModule } from '../directive/directives.module';
import { ListProduitComponent } from './list-produit/list-produit.component';
import { MenuComponent } from './menu/menu.component';
import { GotoLoginComponent } from './goto-login/goto-login.component';
import { GotoRegisterComponent } from './goto-register/goto-register.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule, DirectivesModule,
    IonicModule,
  ],
  declarations: [ImagesComponent, TestComponent, CustomInputComponent,
     PointVenteComponent, ListProduitComponent, MenuComponent, GotoLoginComponent,
     GotoRegisterComponent
  ],
  exports: [ImagesComponent, TestComponent, CustomInputComponent,
    GotoRegisterComponent,  
     PointVenteComponent, ListProduitComponent, MenuComponent, GotoLoginComponent
  ],
})
export class ComponentsModule {}
