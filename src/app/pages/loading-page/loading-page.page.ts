import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-loading-page',
  templateUrl: './loading-page.page.html',
  styleUrls: ['./loading-page.page.scss'],
})
export class LoadingPagePage implements OnInit {

  constructor(private router: Router) {
    StatusBar.setBackgroundColor({ color: "#50c8ff" });
   }

  ngOnInit() {
    setTimeout(()=>{
      this.router.navigateByUrl('/');
    }, 3400)
  }

}
