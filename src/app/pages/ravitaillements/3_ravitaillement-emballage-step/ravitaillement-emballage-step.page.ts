import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Casier } from 'src/app/models/Casiers';
import { Custom_Casier_Model, TransactionType } from 'src/app/models/Ravitaillements';
import { CasierService } from 'src/app/services/casier.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';


@Component({
  selector: 'app-ravitaillement-emballage-step',
  templateUrl: './ravitaillement-emballage-step.page.html',
  styleUrls: ['./ravitaillement-emballage-step.page.scss'],
})
export class RavitaillementEmballageStepPage implements OnInit {
  readonly transactionTypeIn = TransactionType.IN
  readonly transactionTypeOut = TransactionType.OUT
  casiers: Custom_Casier_Model[] = [];
  typeCasiers: Casier[] = [ ];

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private casierScv: CasierService,
    private ravSvc: RavitaillementService
  ) {}

  ngOnInit() {
  }

  async ionViewWillEnter(){
    await this.casierScv.getAll();
    this.casierScv.casierSubject.subscribe({
      next: (casiers: Casier[]) =>{
        if(casiers.length){
          let list_casier : Custom_Casier_Model[] = casiers.map((casier: Casier) => {
            let val: Custom_Casier_Model = {
              id: casier?.id!,
              nom: casier?.nom!,
              qte: 0,
              transaction: TransactionType.IN
            }
            return val;
          })
          this.typeCasiers = list_casier;
        }
      }
    })
  }

  next(){
    this.router.navigateByUrl('/ravitaillement-confirmation-step');
    this.ravSvc.getRavitaillementInstance()._casier = this.casiers;
    this.ravSvc.getRavitaillementInstance().date = new Date().getTime();
    console.log(this.ravSvc.getRavitaillementInstance());
    this.ravSvc.save();
  }
  prev(){
    this.navCtrl.navigateBack('/ravitaillement-produit-step');
    this.ravSvc.getRavitaillementInstance()._casier = this.casiers;
  }

  /**
   * add Element to casiers
   * @param transactionType 
   * @param casier 
   * @param qte 
   * @returns void
   */
  addCasier(transactionType: TransactionType, casier: Casier, qty: HTMLInputElement){
    
    let quantite: number = parseInt(qty?.value , 10);
    // console.log({transaction: transactionType, casier: casier, qte: quantite})
    if(isNaN(quantite) || quantite < 1){
      showToast('Quantité doit être superieure à 0', "danger");
      return
    }

    if(!casier){
      showToast('Renseigner le casier', "danger");
      return
    }

    if(transactionType && Object.keys(casier).includes('nom') && quantite){

      let casierExist = this.casiers.findIndex((value: Custom_Casier_Model) => value.nom == casier.nom && value.transaction == transactionType);
      let newCasier : Custom_Casier_Model = {id: 0, nom: casier.nom!, qte: quantite, transaction: transactionType };
      if(casierExist == -1){
        // init id of casier
        newCasier.id = this.casiers.length ? this.casiers[this.casiers.length - 1].id + 1 : 1;
        this.casiers.push(newCasier);
      }else{
        // replace casier
        newCasier.id = this.casiers[casierExist].id;
        this.casiers[casierExist] = newCasier;
      }
      qty.value = "";
    }else{
      showToast('Une erreur', "danger");
      return
    }
    console.log(this.casiers)
  }

}
