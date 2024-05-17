import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { showToast, toTimestamp } from 'src/app/_lib/lib';
import { Employe } from 'src/app/models/Employes';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { BdService } from 'src/app/services/-bd.service';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-more-detail',
  templateUrl: './more-detail.page.html',
  styleUrls: ['./more-detail.page.scss'],
})
export class MoreDetailPage implements OnInit {

  // public total!: number;

  formGroup!: FormGroup;
  employes: Employe[] = [];
  constructor(public formBuilder: FormBuilder, public bdSvc: BdService, public inventorySvc: InventoryService) { }

  async ngOnInit() {
    this.employes = await this.allEmploye() as Employe[];
    console.log("les employes sont : ", this.employes);
    this.formGroup = this.formBuilder.group({
      total: [0, [Validators.required, Validators.min(0)]],
      versement: [0, [Validators.required, Validators.min(0)]],
      ids_employe: [[this.employes[this.employes.length - 1].id || 0], [Validators.required]],
      date: [(new Date()).toJSON(), [Validators.required]]
    });
    console.log(this.employes)
  }
  async onSubmit(){
    if(this.formGroup.valid){
      let formValues: {date:string, total: number, versement: number, ids_employe: Array<number>} = this.formGroup.value;
      this.inventorySvc.getInventoryInstance().date = toTimestamp(formValues.date);
      this.inventorySvc.getInventoryInstance().total = formValues.total;
      this.inventorySvc.getInventoryInstance().versement = formValues.versement;
      this.inventorySvc.getInventoryInstance().ids_employe = JSON.stringify(formValues.ids_employe);

      console.log(this.inventorySvc.restes);

      let all_ravitaillements: Array<Ravitaillement> |false= await this.inventorySvc.getUninventoryRavitaillements(); 
      if(!all_ravitaillements || !all_ravitaillements.length){
        showToast('pas de ravitaillement en cours', 'danger');
        console.log("pas de ravitaillement")
        return;
      }
    }else{
      showToast("Formulaire mal rempli", "danger")
    }
  }

  dateChange($event: CustomEvent){
    console.log($event.detail.value)
  }

  async allEmploye(){
    return await this.bdSvc.readAll("Employe")
  }

  toto(){
    console.log("toto")
  }
}
