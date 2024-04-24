import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Depense } from 'src/app/models/Depenses';
import { DepenseService } from 'src/app/services/depense.service';

@Component({
  selector: 'app-depense',
  templateUrl: './depense.page.html',
  styleUrls: ['./depense.page.scss'],
})
export class DepensePage implements OnInit {
  
  depenses : any[] = [];
  constructor(
    private depenseSvc: DepenseService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    this.initializeDepenseData();
  }

  async initializeDepenseData(): Promise<void>{
    let all = await this.depenseSvc.getAll();
    console.log(all)
    this.depenseSvc.depenseSubject.subscribe({
      next: (items: any[]) => {
        this.depenses = items;
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

  async delete(depense: Depense, slidingItem:any){
    slidingItem.close();
    let item : Depense = this.depenseSvc.hydrateDepense(depense);
    let role = await this.confirm();
    if(role == "confirm"){
      this.depenseSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(depense:Depense){
    this.router.navigateByUrl("/add-update-depense/update", {state: depense});
  }
}
