import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInput, ToastController } from '@ionic/angular';
import { resetForm, showToast } from 'src/app/_lib/lib';
import { Categorie, CategorieType } from 'src/app/models/Categories';
import { CategorieService } from 'src/app/services/categorie.service';

@Component({
  selector: 'app-add-update-categorie',
  templateUrl: './add-update-categorie.page.html',
  styleUrls: ['./add-update-categorie.page.scss'],
})
export class AddUpdateCategoriePage implements OnInit {

  categorieForm!: FormGroup;
  categorie!: Categorie;

  action!: 'update' | 'add';
  type!: CategorieType;
  constructor(private formBuilder: FormBuilder, 
    private categorieSvc: CategorieService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.categorie = history.state;
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.type = this.route.snapshot.paramMap.get('type') as CategorieType;
    this.initForm();
  }

  initForm() {
    this.categorieForm = this.formBuilder.group({
      nom: [this.categorie.nom || '', Validators.required],
      description: [this.categorie.description || ''],
      type: [this.type ]
    });
  }

  submit() {

    if(this.categorieForm.invalid) {
      showToast("Remplissez les champ!");
      return;
    }
    if(!this.type){
      console.log("le type est mal defini");
      return;
    }
    const formData = this.categorieForm.value;
    console.log(formData);
    let newCategorie : Categorie = this.categorieSvc.hydrateCategorie(formData);
    
    // console.log(newCategorie); return;
    if(this.action === "update"){
      console.log("update")
      newCategorie.id = this.categorie.id;
      newCategorie.deletedAt = this.categorie.deletedAt;

      this.categorieSvc.update(newCategorie).then((val:any)=>{
        if(val){
          showToast("element mis à jour")
          resetForm(this.categorieForm);
          this.router.navigateByUrl(`/categorie/${this.type}`)
        }
      }).catch((error: any)=> showToast("Veuillez réessayer", 'danger'));

    }else{

      this.categorieSvc.create(newCategorie).then((val:any)=>{
        if(val){
          showToast("Nouveau element créer")
          resetForm(this.categorieForm);
          this.router.navigateByUrl(`/categorie/${this.type}`)
        }
      }).catch((error:any)=> showToast("Veuillez réessayer", 'danger'));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la categorie à votre application
  }

  modifierCategorie() {
    const formData = this.categorieForm.value;
    const categorieModifiee = new Categorie(formData.nom, formData.description, formData.deletedAt, formData.id);

    // Vous pouvez ajouter ici la logique pour modifier la Categorie dans votre application
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
  //   this.categorieForm.get('nbre_btle_par_categorie')?.setValue(filteredValue);
  // }

}
