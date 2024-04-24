import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, ToastController } from '@ionic/angular';
import { resetForm, showToast } from 'src/app/_lib/lib';
import { Categorie } from 'src/app/models/Categories';
import { Depense } from 'src/app/models/Depenses';
import { Produit } from 'src/app/models/Produits';
import { DepenseService } from 'src/app/services/depense.service';

@Component({
  selector: 'app-add-update-depense',
  templateUrl: './add-update-depense.page.html',
  styleUrls: ['./add-update-depense.page.scss'],
})
export class AddUpdateDepensePage implements OnInit {

    
  depenseForm!: FormGroup;
  depense!: Depense;

  type : Categorie[] = [];

  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private depenseSvc: DepenseService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    const memo = history.state as Depense;
    if(memo.hasOwnProperty("id")) this.depense = this.depenseSvc.hydrateDepense(memo);
    
    console.log(this.depense);
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();

    this.type = await this.depenseSvc.getTypeDepense();
    if(this.type.length < 1) return showToast('Veuillez paramétrer le produit');
    
  }

  initForm() {
    // console.log(this.depense);
    if(this.action == "update"){
      // console.log("update")
      this.depenseForm = this.formBuilder.group({
        date: [this.depense.date, Validators.required],
        type: [this.depense.type, [Validators.required]],
        motif: [this.depense.motif, Validators.required],
        montant: [this.depense.montant, Validators.required],
      });
      
      return;
    }
    this.depenseForm = this.formBuilder.group({
      date: ["", Validators.required],
      type: ["", [Validators.required]],
      motif: ["", Validators.required],
      montant: ["", Validators.required],
    });
  }

  loadTypeDepense(){
    this.depenseSvc.getTypeDepense()
  }

  submit() {
    // console.log(this.depenseForm.value); return;
    if(this.depenseForm.invalid) {
      showToast("Remplissez les champ!");
      return;
    }

    const formData = this.depenseForm.value;

    let newDepense : Depense = this.depenseSvc.hydrateDepense(formData);
    // console.log(newDepense); return;
    if(this.action === "update"){
      console.log("update")
      newDepense.id = this.depense.id;

      this.depenseSvc.update(newDepense).then((val: any)=>{
        if(val){
          showToast("element mis à jour")
          resetForm(this.depenseForm);
          this.router.navigateByUrl("/depense")
        }
      }).catch((error:any)=> showToast("Veuillez réessayer"));

    }else{

      this.depenseSvc.create(newDepense).then((val: any)=>{
        if(val){
          showToast("Nouveau element créer")
          resetForm(this.depenseForm);
          this.router.navigateByUrl("/depense")
        }
      }).catch((error:any)=> showToast("Veuillez réessayer"));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la Depense à votre application
  }

  @ViewChild('ionInputEl', { static: true }) ionInputEl!: IonInput;
  filteredNumber(ev:any){
    const value = ev.target!.value;

    // Removes non alphanumeric characters
    const filteredValue = value.replace(/[^0-9]+/g, '');

    /**
     * Update both the state variable and
     * the component to keep them in sync.
     */
    this.depenseForm.get('nbre_btle_par_depense')?.setValue(filteredValue);
  }

}
