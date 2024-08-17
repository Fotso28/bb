import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { resetForm } from 'src/app/_lib/lib';
import { Famille } from 'src/app/models/Familles';
import { FamilleService } from 'src/app/services/famille.service';

@Component({
  selector: 'app-add-update-famille',
  templateUrl: './add-update-famille.page.html',
  styleUrls: ['./add-update-famille.page.scss'],
})
export class AddUpdateFamillePage implements OnInit {

  familleForm!: FormGroup;
  famille!: Famille;
  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private familleSvc: FamilleService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.famille = history.state;
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();
  }

  initForm() {
    this.familleForm = this.formBuilder.group({
      nom: [this.famille.nom || '', Validators.required],
      description: [this.famille.description || '']
    });
  }

  


  submit() {
    if(this.familleForm.invalid) {
      this.showToast("Remplissez les champ!");
      return;
    }

    const formData = this.familleForm.value;

    let newFamille : Famille = this.familleSvc.hydrateFamille(formData);
    // console.log(newFamille); return;
    if(this.action === "update"){
      console.log("update")
      newFamille.id = this.famille.id;
      newFamille.deletedAt = this.famille.deletedAt;

      this.familleSvc.update(newFamille).then((val)=>{
        if(val){
          this.showToast("element mis à jour")
          resetForm(this.familleForm);
          this.router.navigateByUrl("/famille")
        }
      }).catch((error)=> this.showToast("Veuillez réessayer"));

    }else{

      this.familleSvc.create(newFamille).then((val)=>{
        if(val){
          this.showToast("Nouveau element créer")
          resetForm(this.familleForm);
          this.router.navigateByUrl("/famille")
        }
      }).catch((error)=> this.showToast("Veuillez réessayer"));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la famille à votre application
  }

  modifierFamille() {
    const formData = this.familleForm.value;
    const familleModifiee = new Famille(formData.nom, formData.description, formData.deletedAt, formData.id);

    // Vous pouvez ajouter ici la logique pour modifier la famille dans votre application
  }

  async showToast(message: string, color: string = 'success'){
    let toast = await this.toast.create({
      message: message,
      duration: 2000,
      position: "bottom",
      icon: "home",
      mode: 'ios',
      color: color,
    });
    await toast.present()
  }

 

}
