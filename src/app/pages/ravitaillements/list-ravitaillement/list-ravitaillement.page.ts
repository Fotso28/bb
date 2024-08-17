import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { showError, showLoading } from 'src/app/_lib/lib';
import { PointVente } from 'src/app/models/PointVentes';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { BdService } from 'src/app/services/-bd.service';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-list-ravitaillement',
  templateUrl: './list-ravitaillement.page.html',
  styleUrls: ['./list-ravitaillement.page.scss'],
})
export class ListRavitaillementPage implements OnInit {

  all_ravitaillements: Ravitaillement[] = [];
  constructor(private router: Router, private bdSvc: BdService, private pvSvc: PointVenteService, private ravSvc: RavitaillementService) { }

  async ngOnInit() {
    
  }
  async ionViewWillEnter(){
    let activePointvente: null | PointVente = this.pvSvc.getActivePointeVente();
    if(!activePointvente){
      showError("Aucun point de vente n'est defini");
      return;
    }
    this.all_ravitaillements =  await this.bdSvc.readAll("Ravitaillement", `AND id_point_vente = ${activePointvente.id}`)
  }

  viewAndUpdateRavitaillemnt(rav: Ravitaillement){
    this.ravSvc.ravitaillement = rav;
    this.router.navigateByUrl("/ravitaillement-confirmation-step/view_update");
  }

  async changePointVente(activePointvente: PointVente){
    let loading = showLoading()
    this.all_ravitaillements =  await this.bdSvc.readAll("Ravitaillement", `AND id_point_vente = ${activePointvente.id}`);
    (await loading).dismiss()
  }

}
