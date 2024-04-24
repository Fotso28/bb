import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ravitaillement-emballage-step',
  templateUrl: './ravitaillement-emballage-step.page.html',
  styleUrls: ['./ravitaillement-emballage-step.page.scss'],
})
export class RavitaillementEmballageStepPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  next(){
    this.router.navigateByUrl('/ravitaillement-confirmation-step')
  }
  prev(){
    this.navCtrl.navigateBack('/ravitaillement-produit-step')
  }

}
