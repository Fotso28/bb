import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, Platform, ToastController } from '@ionic/angular';
import { MAX_QTY_LENGHT, MIN_QTY_LENGHT } from 'src/app/_lib/const';
import { resetForm, showToast, trimAndParseInt } from 'src/app/_lib/lib';
import { Casier } from 'src/app/models/Casiers';
import { CasierService } from 'src/app/services/casier.service';


@Component({
  selector: 'app-add-update-casier',
  templateUrl: './add-update-casier.page.html',
  styleUrls: ['./add-update-casier.page.scss'],
})
export class AddUpdateCasierPage implements OnInit {
  
  casierForm!: FormGroup;
  casier!: Casier;
  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private casierSvc: CasierService,
    private toast: ToastController,
    private platform: Platform,
    private route: ActivatedRoute,
    private router: Router) { 
       
  }

  

  ngOnInit() {
    this.casier = history.state;
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();
  }

  initForm() {
    this.casierForm = this.formBuilder.group({
      nom: [this.casier?.nom || '', Validators.required],
      description: [this.casier?.description || ''],
      nbre_btle_par_casier: [this.casier?.nbre_btle_par_casier?.toString() || '1', [Validators.required, Validators.pattern(/^[0-9\s]+$/), Validators.min(1)]]
    });
  }

  submit() {

    if(this.casierForm.invalid) {
      showToast("Remplissez les champ!");
      return;
    }

    const formData = this.casierForm.value;
    formData.nbre_btle_par_casier = trimAndParseInt(formData.nbre_btle_par_casier)
    let newCasier : Casier = this.casierSvc.hydrateCasier(formData);

    console.log(newCasier);
    // console.log(newCasier); return;
    if(this.action === "update"){
      console.log("update")
      newCasier.id = this.casier.id;
      newCasier.deletedAt = this.casier.deletedAt;

      this.casierSvc.update(newCasier).then((val)=>{
        if(val){
          showToast("element mis à jour")
          resetForm(this.casierForm);
          this.router.navigateByUrl("/casier")
        }
      }).catch((error)=> showToast("Veuillez réessayer"));

    }else{

      this.casierSvc.create(newCasier).then((val)=>{
        if(val){
          showToast("Nouveau element créer")
          resetForm(this.casierForm);
          this.router.navigateByUrl("/casier")
        }
      }).catch((error)=> showToast("Veuillez réessayer"));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la casier à votre application
  }

  

  // @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;
  // filteredNumber(ev:any){
  //   const value = ev.target!.value;

  //   // Removes non alphanumeric characters
  //   const filteredValue = value.replace(/[^0-9]+/g, '');

  //   /**
  //    * Update both the state variable and
  //    * the component to keep them in sync.
  //    */
  //   this.casierForm.get('nbre_btle_par_casier')?.setValue(filteredValue);
  // }


}
