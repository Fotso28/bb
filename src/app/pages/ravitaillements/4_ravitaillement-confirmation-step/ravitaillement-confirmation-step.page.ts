import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-ravitaillement-confirmation-step',
  templateUrl: './ravitaillement-confirmation-step.page.html',
  styleUrls: ['./ravitaillement-confirmation-step.page.scss'],
})
export class RavitaillementConfirmationStepPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  prev(){
    this.navCtrl.navigateBack("//ravitaillement-emballage-step")
  }
}
