import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Casier } from 'src/app/models/Casiers';
import { CasierService } from 'src/app/services/casier.service';

@Component({
  selector: 'app-casier',
  templateUrl: './casier.page.html',
  styleUrls: ['./casier.page.scss'],
})
export class CasierPage implements OnInit {

  casiers : Casier[] = [];
  constructor(
    private casierSvc: CasierService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    this.initializeCasierData();
  }

  async initializeCasierData(): Promise<void>{
    let all = await this.casierSvc.getAll();
    console.log(all)
    this.casierSvc.casierSubject.subscribe({
      next: (items: Casier[]) => {
        this.casiers = items;
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

  async delete(casier: Casier, slidingItem:any){
    slidingItem.close();
    let item : Casier = this.casierSvc.hydrateCasier(casier);
    let role = await this.confirm();
    if(role == "confirm"){
      this.casierSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(casier:Casier){
    this.router.navigateByUrl("/add-update-casier/update", {state: casier});
  }

}
