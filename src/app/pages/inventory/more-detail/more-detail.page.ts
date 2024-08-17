import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DBSQLiteValues } from '@capacitor-community/sqlite';
import { showToast, toTimestamp } from 'src/app/_lib/lib';
import { Employe } from 'src/app/models/Employes';
import { BdService } from 'src/app/services/-bd.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { RavitaillementService } from 'src/app/services/ravitaillement.service';

@Component({
  selector: 'app-more-detail',
  templateUrl: './more-detail.page.html',
  styleUrls: ['./more-detail.page.scss'],
})
export class MoreDetailPage implements OnInit {

  // public total!: number;

  formGroup!: FormGroup;
  employes: Employe[] = [];
  constructor(public router: Router, public pointVenteSvc: PointVenteService, public ravSvc: RavitaillementService, public formBuilder: FormBuilder, public bdSvc: BdService, public inventorySvc: InventoryService) { }

  async ngOnInit() {
    
    this.employes = await this.allEmploye() as Employe[];

    this.formGroup = this.formBuilder.group({
      total: [this.inventorySvc.montantTotalVendu, [Validators.required, Validators.min(0)]],
      versement: [0, [Validators.required, Validators.min(0)]],
      ids_employe: [[this.employes[this.employes.length - 1].id || 0], [Validators.required]],
      date: [(new Date()).toJSON(), [Validators.required]]
    });
    console.log("lastStockProduct", this.inventorySvc.lastStockProduct);
    console.log("restes", this.inventorySvc.restes);
    console.log("somProduitVendu", this.inventorySvc.somProduitVendu);
    console.log("ids_ravitaillement", this.inventorySvc.ids_ravitaillement);
    console.log("montantTotalVendu", this.inventorySvc.montantTotalVendu);
  }


  async onSubmit(){

    if(this.formGroup.valid){
      // 1. Retrieve the additional information from the form
      let formValues: {date:string, total: number, versement: number, ids_employe: Array<number>} = this.formGroup.value;
      this.inventorySvc.getInventoryInstance().date = toTimestamp(formValues.date);
      this.inventorySvc.getInventoryInstance().produits = JSON.stringify(this.inventorySvc.somProduitVendu);
      this.inventorySvc.getInventoryInstance().total = this.inventorySvc.montantTotalVendu;
      this.inventorySvc.getInventoryInstance().versement = formValues.versement;
      this.inventorySvc.getInventoryInstance().ids_employe = JSON.stringify(formValues.ids_employe);
      this.inventorySvc.getInventoryInstance().id_point_vente = this.pointVenteSvc.getActivePointeVente()?.id!;
      this.inventorySvc.getInventoryInstance().ids_ravitaillement = JSON.stringify(this.inventorySvc.ids_ravitaillement);

      console.log(this.inventorySvc.getInventoryInstance())
      
      this.inventorySvc.getInventoryInstance().id_lastStock = this.inventorySvc.lastStockProduct_id;


      //Save the current rest
      let _stockSave_id: false | DBSQLiteValues  = await this.inventorySvc.saveCurrentStock(this.inventorySvc.restes, true);
      console.log(_stockSave_id)
      if(!_stockSave_id){
        throw new Error("Enregistrement échoué")
        return
      }
      let val: any = _stockSave_id.values as any[];
      this.inventorySvc.getInventoryInstance().id_reste = val[0].id;                 // calcul and sum and save product sell in the database
      
      let isSaved = await this.inventorySvc.saveProduitVendu(this.inventorySvc.getInventoryInstance(), true);
      console.log(isSaved)
      
      let isUpdate = await this.inventorySvc.markAllAsRavitaille();
      console.log("isUpdate est ", isUpdate);
      this.router.navigateByUrl('/list-inventory')
    }else{
      showToast("Formulaire mal rempli", "danger")
    }
  }

  async allEmploye(){
    return await this.bdSvc.readAll("Employe")
  }
}
