import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-goto-login',
  templateUrl: './goto-login.component.html',
  styleUrls: ['./goto-login.component.scss'],
})
export class GotoLoginComponent  implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {}

  gotoLogin(){
    this.router.navigateByUrl("/login")
  }

}
