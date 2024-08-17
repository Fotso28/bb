import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';
import { showToast } from 'src/app/_lib/lib';
import { PointVente } from 'src/app/models/PointVentes';
import { PointVenteService } from 'src/app/services/point-vente.service';

@Component({
  selector: 'app-point-vente',
  templateUrl: './point-vente.page.html',
  styleUrls: ['./point-vente.page.scss'],
})
export class PointVentePage implements OnInit {

  pointVentes : PointVente[] = [];
  constructor(
    public pointVenteSvc: PointVenteService,
    private actionSheetCtrl: ActionSheetController,
     private router: Router) {}

  async ngOnInit() {
    this.initializePointVenteData();
  }

  async initializePointVenteData(): Promise<void>{
    let all = await this.pointVenteSvc.getAll();
    console.log(all)
    this.pointVenteSvc.pointVenteSubject.subscribe({
      next: (items: PointVente[]) => {
        this.pointVentes = items;
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

  async delete(pointVente: PointVente, slidingItem:any){
    slidingItem.close();
    let item : PointVente = this.pointVenteSvc.hydratePointVente(pointVente);
    let role = await this.confirm();
    if(role == "confirm"){
      this.pointVenteSvc.delete(item).then((value:boolean)=>{
        if(value){
          showToast('Bien supprimé!')
        }
      })
    }
    
  }

  gotoFamilleDetail(pointVente:PointVente){
    this.router.navigateByUrl("/add-update-point-vente/update", {state: pointVente});
  }
}
