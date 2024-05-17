import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberInput]'
})
export class NumberInputDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    console.log(value)
    // Remplacer les caractères non numériques par une chaîne vide
    input.value = value.replace(/[^0-9]/g, '');
  }

}
