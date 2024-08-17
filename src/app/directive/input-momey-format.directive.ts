import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputMomeyFormat]'
})
export class InputMomeyFormatDirective {

  constructor(private el?: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let originalValue = input.value;
    console.log(originalValue)
    const formatted = this.formatNumber(originalValue);

    if (originalValue !== formatted) {
      const start = input.selectionStart;
      const end = input.selectionEnd;

      input.value = formatted;

      const newLength = formatted.length;
      input.setSelectionRange(newLength, newLength);
    }
  }

  private formatNumber(value: string): string {
    // Supprime tous les caractères non numériques et espaces en début de chaîne
    let cleaned = value.replace(/^\s+|\D+/g, '');

    // if(!/^[0-9]+(\s[0-9]+)*$/.test(value) || /^00/.test(value)){
    //   cleaned = ""
    // }
    if(/^0.{1,}/.test(cleaned)){
      cleaned = cleaned.slice(1);
    }
    // Ajoute des espaces après chaque groupe de 3 chiffres
    const formatted = cleaned.replace(/(\d{1,3})(?=(\d{3})+(?!\d))/g, '$1 ');
    return formatted.trim();
  }
}
