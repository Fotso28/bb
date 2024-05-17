import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, ToastController } from '@ionic/angular';
import { resetForm } from 'src/app/_lib/lib';
import { PointVente } from 'src/app/models/PointVentes';
import { PointVenteService } from 'src/app/services/point-vente.service';

@Component({
  selector: 'app-add-update-point-vente',
  templateUrl: './add-update-point-vente.page.html',
  styleUrls: ['./add-update-point-vente.page.scss'],
})
export class AddUpdatePointVentePage implements OnInit {

  pointVenteForm!: FormGroup;
  pointVente!: PointVente;
  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private pointVenteSvc: PointVenteService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.pointVente = history.state;
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();
  }

  initForm() {
    if(this.action == "update"){
      console.log("update")
      this.pointVenteForm = this.formBuilder.group({
        nom: [this.pointVente.nom, Validators.required],
        description: [this.pointVente.description],
        adresse: [this.pointVente.adresse]
      });
      return;
    }
    this.pointVenteForm = this.formBuilder.group({
      nom: ['', Validators.required],
      description: [''],
      adresse: [""]
    });
  }

  submit() {

    if(this.pointVenteForm.invalid) {
      this.showToast("Remplissez les champ!");
      return;
    }

    const formData = this.pointVenteForm.value;

    let newPointVente : PointVente = this.pointVenteSvc.hydratePointVente(formData);
    // console.log(newPointVente); return;
    if(this.action === "update"){
      console.log("update")
      newPointVente.id = this.pointVente.id;
      newPointVente.deletedAt = this.pointVente.deletedAt;

      this.pointVenteSvc.update(newPointVente).then((val:any)=>{
        if(val){
          this.showToast("element mis à jour")
          resetForm(this.pointVenteForm);
          this.router.navigateByUrl("/point-vente")
        }
      }).catch((error:any)=> this.showToast("Veuillez réessayer"));

    }else{

      this.pointVenteSvc.create(newPointVente).then((val: any)=>{
        if(val){
          this.showToast("Nouveau element créer")
          resetForm(this.pointVenteForm);
          this.router.navigateByUrl("/point-vente");
          // let activePoint = this.pointVenteSvc.getActivePointeVente();
          
        }
      }).catch((error:any)=> this.showToast("Veuillez réessayer"));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la PointVente à votre application
  }

  modifierPointVente() {
    const formData = this.pointVenteForm.value;
    const pointVenteModifiee = new PointVente(formData.nom, formData.description, formData.deletedAt, formData.id);

    // Vous pouvez ajouter ici la logique pour modifier la pointVente dans votre application
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
    this.pointVenteForm.get('nbre_btle_par_pointVente')?.setValue(filteredValue);
  }

}
