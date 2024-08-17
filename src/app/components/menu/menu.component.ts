import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent  implements OnInit {
  @Input() show: boolean = false;
  constructor() { }

  ngOnInit() {
    window.addEventListener('scroll', this.onScroll)
  }
  onScroll(event: any){
    if(this.show == true){
      this.show = false
    }
  }

}
