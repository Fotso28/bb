import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {
    transform(value: number, currencySymbol: string = 'XAF', position: 'before' | 'after' = 'after'): string {
      const integerPart = Math.floor(value);
      const decimalPart = value - integerPart;
  
      let formattedValue;
  
      if (decimalPart === 0) {
        formattedValue = new Intl.NumberFormat('fr-FR').format(integerPart);
      } else {
        formattedValue = new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      }
  
      if (position === 'after') {
        return `${formattedValue} ${currencySymbol}`;
      } else {
        return `${currencySymbol} ${formattedValue}`;
      }
    }
  }