import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, Platform } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Avaris } from 'src/app/models/Avaris';
import { AvarisService } from 'src/app/services/avaris.service';

@Component({
  selector: 'app-avaris',
  templateUrl: './avaris.page.html',
  styleUrls: ['./avaris.page.scss'],
})
export class AvarisPage implements OnInit {

  avaris : any[] = [];
  constructor(
    private avarisSvc: AvarisService,
    
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    this.initializeAvarisData();
  }

  async initializeAvarisData(): Promise<void>{
    let all = await this.avarisSvc.getAll();
    console.log(all)
    this.avarisSvc.avarisSubject.subscribe({
      next: (items: Avaris[]) => {
        this.avaris = items;
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

  async delete(avaris: Avaris, slidingItem:any){
    slidingItem.close();
    let item : Avaris = this.avarisSvc.hydrateAvaris(avaris);
    let role = await this.confirm();
    if(role == "confirm"){
      this.avarisSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(avaris:Avaris){
    this.router.navigateByUrl("/add-update-avaris/update", {state: avaris});
  }

}
