import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { InputMomeyFormatDirective } from "./input-momey-format.directive";

@NgModule({
    imports: [
      CommonModule,
      IonicModule,
    ],
    declarations: [InputMomeyFormatDirective],
    exports: [InputMomeyFormatDirective],
  })
  export class DirectivesModule {}