import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { IonicModule } from "@ionic/angular";
import { CustomCurrencyPipe } from "./currencyPype";

@NgModule({
    imports: [
      CommonModule,
      IonicModule,
    ],
    declarations: [CustomCurrencyPipe],
    exports: [CustomCurrencyPipe],
  })
export class PipeModule {}