import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, ToastController } from '@ionic/angular';
import { resetForm, showToast } from 'src/app/_lib/lib';
import { Avaris } from 'src/app/models/Avaris';
import { Produit } from 'src/app/models/Produits';
import { AvarisService } from 'src/app/services/avaris.service';

@Component({
  selector: 'app-add-update-avaris',
  templateUrl: './add-update-avaris.page.html',
  styleUrls: ['./add-update-avaris.page.scss'],
})
export class AddUpdateAvarisPage implements OnInit {
 
  avarisForm!: FormGroup;
  avaris!: Avaris;

  produits : Produit[] = [];

  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private avarisSvc: AvarisService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private router: Router) { }

  async ngOnInit() {
    const memo = history.state as Avaris;
    if(memo.hasOwnProperty("id")) this.avaris = this.avarisSvc.hydrateAvaris(memo);
    
    console.log(this.avaris);
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();

    this.produits = await this.avarisSvc.getProduit();
    if(this.produits.length < 1) return showToast('Veuillez paramétrer le produit');
    
  }

  initForm() {
    // console.log(this.avaris);
    if(this.action == "update"){
      // console.log("update")
      this.avarisForm = this.formBuilder.group({
        produit_id: [this.avaris.produit_id, Validators.required],
        qte: [this.avaris.qte, [Validators.required]],
        description: [this.avaris.description, Validators.required],
        date: [this.avaris.date, Validators.required]
      });
      
      return;
    }
    this.avarisForm = this.formBuilder.group({
      produit_id: ["", Validators.required],
      qte: ["", [Validators.required]],
      description: ["", Validators.required],
      date: ["", Validators.required]
    });
  }

  submit() {
    // console.log(this.avarisForm.value); return;
    if(this.avarisForm.invalid) {
      this.showToast("Remplissez les champ!");
      return;
    }

    const formData = this.avarisForm.value;

    let newAvaris : Avaris = this.avarisSvc.hydrateAvaris(formData);
    // console.log(newavaris); return;
    if(this.action === "update"){
      console.log("update")
      newAvaris.id = this.avaris.id;

      this.avarisSvc.update(newAvaris).then((val: any)=>{
        if(val){
          this.showToast("element mis à jour")
          resetForm(this.avarisForm);
          this.router.navigateByUrl("/avaris")
        }
      }).catch((error:any)=> this.showToast("Veuillez réessayer"));

    }else{

      this.avarisSvc.create(newAvaris).then((val)=>{
        if(val){
          this.showToast("Nouveau element créer")
          resetForm(this.avarisForm);
          this.router.navigateByUrl("/avaris")
        }
      }).catch((error:any)=> this.showToast("Veuillez réessayer"));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la Avaris à votre application
  }


  async showToast(message: string){
    let toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: "bottom",
      icon: "home",
      mode: 'ios',
      color: "danger",
    });
    await toast.present()
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
    this.avarisForm.get('nbre_btle_par_avaris')?.setValue(filteredValue);
  }

}
