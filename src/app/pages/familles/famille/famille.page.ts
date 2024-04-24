import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';

import { Famille } from 'src/app/models/Familles';
import { FamilleService } from 'src/app/services/famille.service';

@Component({
  selector: 'app-famille',
  templateUrl: './famille.page.html',
  styleUrls: ['./famille.page.scss'],
})
export class FamillePage implements OnInit {

  familles : Famille[] = [];
  constructor(private familleSvc: FamilleService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    this.initializeFamiileData();
  }

  async initializeFamiileData(): Promise<void>{
    await this.familleSvc.getAll();
    this.familleSvc.familleSubject.subscribe({
      next: (items: Famille[]) => {
        this.familles = items;
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

  async delete(famille: Famille, slidingItem:any){
    slidingItem.close();
    let item : Famille = this.familleSvc.hydrateFamille(famille);
    let role = await this.confirm();
    if(role == "confirm"){
      this.familleSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(famille:Famille){
    this.router.navigateByUrl("/add-update-famille/update", {state: famille});
  }

}
