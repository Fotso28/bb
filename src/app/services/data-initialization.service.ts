import { Injectable } from '@angular/core';
import { BdService } from './-bd.service';
import { PointVente } from '../models/PointVentes';
import { PointVenteService } from './point-vente.service';
import { showError } from '../_lib/lib';

@Injectable({
  providedIn: 'root'
})
export class DataInitializationService {

  constructor(private bdSvc: BdService
    ,private pvSvc: PointVenteService
  ) { }

  async initializeDatabase(){

    let bdIsInit: boolean = false;

    if(!this.bdSvc.dbIsready){
      bdIsInit = await this.bdSvc.initDatabase()
    }

    if(!this.bdSvc.dbIsready){
      throw Error("La base de donnée n'est initialisée !!")
    }

    if(bdIsInit){
      let activeUser = await this.bdSvc.getActiveUser();

      if(!activeUser){
        console.log("Aucun utilisateur defini");
        return;
        // this.userSvc.setActiveUser({ id: 1, username: 'Test User', telephone: '699658838', localite: "", token: "jtkls" })
      }
      
      await this.activePointVente();
    }
  }

  async activePointVente(){

    let activePv : PointVente | null = this.pvSvc.getActivePointeVente();
    console.warn(activePv)
    if(activePv){
      return
    }

    // Aucun pv activer
    let allPv : Array<PointVente> = await this.pvSvc.all();
    if(allPv && allPv.length){
      const FIRST_ELEMENT = 0
      this.pvSvc.setActivePointVente(allPv[FIRST_ELEMENT])
    }else{
      // this.router.navigateByUrl('/add-update-point-vente/add');
    }
  }

  async clearParamsData(){
    await this.bdSvc.deleteActiveUser();
    localStorage.removeItem('pointVente');
    localStorage.removeItem('endDate');
  }
}
