import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Produit } from 'src/app/models/Produits';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-produit',
  templateUrl: './produit.page.html',
  styleUrls: ['./produit.page.scss'],
})
export class ProduitPage implements OnInit {

  produits : Produit[] = [];
  

  constructor(
    private produitSvc: ProduitService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    
  }

  ionViewWillEnter(){
    this.initializeProduitData();
  }

  async initializeProduitData(): Promise<void>{
    let produits = await this.produitSvc.getAll();
    if(Object.keys(produits).length){
      this.produits = produits
    }
  }

  async confirm(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Etes vous sûr ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Oui',
          role: 'confirm',
        },
        {
          text: 'Non',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role;
  }

  async delete(produit: Produit, slidingItem:any){
    slidingItem.close();
    let item : Produit = this.produitSvc.initProduitValues(produit);
    let role = await this.confirm();
    console.log(role);
    if(role == "confirm"){
      this.produitSvc.delete(item).then((value:boolean)=>{
        console.log(value)
        if(value){
          this.initializeProduitData();
          showToast('Bien supprimé!')
        }
      }).catch((e)=> console.log(e))
    }
    
  }

  gotoFamilleDetail(produit:Produit){
    this.router.navigateByUrl("/add-update-produit/update", {state: produit});
  }

 


}
