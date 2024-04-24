import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { Employe } from 'src/app/models/Employes';
import { EmployeService } from 'src/app/services/employe.service';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.page.html',
  styleUrls: ['./employe.page.scss'],
})
export class EmployePage implements OnInit {

  employes : Employe[] = [];
  constructor(
    private employeSvc: EmployeService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    this.initializeEmployeData();
  }

  async initializeEmployeData(): Promise<void>{
    let all = await this.employeSvc.getAll();
    console.log(all)
    this.employeSvc.employeSubject.subscribe({
      next: (items: Employe[]) => {
        this.employes = items;
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

  async delete(employe: Employe, slidingItem:any){
    slidingItem.close();
    let item : Employe = this.employeSvc.hydrateEmploye(employe);
    let role = await this.confirm();
    if(role == "confirm"){
      this.employeSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(employe:Employe){
    this.router.navigateByUrl("/add-update-employe/update", {state: employe});
  }

}
