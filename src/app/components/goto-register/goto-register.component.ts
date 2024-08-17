import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-goto-register',
  templateUrl: './goto-register.component.html',
  styleUrls: ['./goto-register.component.scss'],
})
export class GotoRegisterComponent  implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {}

  gotoRegister(){
    this.router.navigateByUrl("/register")
  }

}
