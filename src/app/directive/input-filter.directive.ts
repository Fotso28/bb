import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appInputFilter]'
})
export class InputFilterDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any): void {
    const inputElement = this.el.nativeElement as HTMLInputElement;
    const inputValue = inputElement.value;

    // Utilise une expression régulière pour valider que l'entrée est un entier naturel
    const naturalNumberPattern = /^\d+$/;
    const isValid = naturalNumberPattern.test(inputValue);

    if (!isValid) {
      // Si l'entrée n'est pas valide, retire les caractères non conformes
      inputElement.value = inputValue.replace(/[^\d]/g, '');
    }
  }
}
