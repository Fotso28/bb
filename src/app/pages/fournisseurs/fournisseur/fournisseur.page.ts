import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Fournisseur } from 'src/app/models/Fournisseurs';
import { FournisseurService } from 'src/app/services/fournisseur.service';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.page.html',
  styleUrls: ['./fournisseur.page.scss'],
})
export class FournisseurPage implements OnInit {

  fournisseurs : Fournisseur[] = [];
  constructor(
    private fournisseurSvc: FournisseurService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    this.initializeFournisseurData();
  }

  async initializeFournisseurData(): Promise<void>{
    let all = await this.fournisseurSvc.getAll();
    console.log(all)
    this.fournisseurSvc.fournisseurSubject.subscribe({
      next: (items: Fournisseur[]) => {
        this.fournisseurs = items;
        console.log(items);
      }
    })
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

  async delete(fournisseur: Fournisseur, slidingItem:any){
    slidingItem.close();
    let item : Fournisseur = this.fournisseurSvc.hydrateFournisseur(fournisseur);
    let role = await this.confirm();
    if(role == "confirm"){
      this.fournisseurSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(fournisseur:Fournisseur){
    this.router.navigateByUrl("/add-update-fournisseur/update", {state: fournisseur});
  }

}
