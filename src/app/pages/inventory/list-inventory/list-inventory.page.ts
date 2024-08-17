import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { showError, showLoading } from 'src/app/_lib/lib';
import { PointVente } from 'src/app/models/PointVentes';
import { Vente } from 'src/app/models/ProduitVendus';
import { InventoryService } from 'src/app/services/inventory.service';
import { PointVenteService } from 'src/app/services/point-vente.service';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.page.html',
  styleUrls: ['./list-inventory.page.scss'],
})
export class ListInventoryPage implements OnInit {

  inventaires!: Vente[];
  constructor(private inventorySvc: InventoryService, private router: Router, private pvSvc: PointVenteService) { }

  async ngOnInit() {
    
  }

  async ionViewWillEnter(){
    let pointVente: PointVente | null = this.pvSvc.getActivePointeVente();
    if(!pointVente || ! pointVente.id){
      showError("Le point de vente n'est pas defini");
      return;
    }
    console.log(pointVente)
    this.inventaires = await this.getInventory(pointVente.id) as Vente[]
    console.log(this.inventaires)
  }

  async getInventory(id: number){
    return await this.inventorySvc.getInventory(id);
  }

  viewInventory(inv: Vente){
    this.router.navigateByUrl('/view-inventory', {state: inv})
  }

  async changePointVente(activePointvente: PointVente){
   
    let loading = showLoading();
    if(!activePointvente || ! activePointvente.id){
      showError("Le point de vente n'est pas defini");
      (await loading).dismiss()
      return;
    }
  
    this.inventaires = await this.getInventory(activePointvente.id) as Vente[];
    
    (await loading).dismiss()
  }
}
