import { Component, OnInit, ViewChild, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadFileResult } from '@capacitor/filesystem';
import { IonInput, ToastController } from '@ionic/angular';
import { MIN_QTY_LENGHT } from 'src/app/_lib/const';
import { resetForm, showToast } from 'src/app/_lib/lib';
import { Casier } from 'src/app/models/Casiers';
import { Categorie } from 'src/app/models/Categories';
import { Famille } from 'src/app/models/Familles';
import { Fournisseur } from 'src/app/models/Fournisseurs';
import { PointVente } from 'src/app/models/PointVentes';
import { Produit } from 'src/app/models/Produits';
import { CameraService, ImageStruct } from 'src/app/services/camera.service';
import { CasierService } from 'src/app/services/casier.service';
import { CategorieService } from 'src/app/services/categorie.service';
import { FamilleService } from 'src/app/services/famille.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { ProduitService } from 'src/app/services/produit.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-update-produit',
  templateUrl: './add-update-produit.page.html',
  styleUrls: ['./add-update-produit.page.scss'],
})
export class AddUpdateProduitPage implements OnInit {

  produitForm!: FormGroup;
  produit!: Produit;
  produit_img_data!: string;

  familles : Famille[] = [];
  categories : Categorie[] = [];
  casiers : Casier[] = [];
  fournisseurs : Fournisseur[] = [];

  action!: 'update' | 'add';
  constructor(private formBuilder: FormBuilder, 
    private produitSvc: ProduitService,
    private toast: ToastController,
    private route: ActivatedRoute,
    private fournisseurSvc: FournisseurService,
    private familleSvc: FamilleService,
    private categorieSvc: CategorieService,
    private casierSvc: CasierService,
    private cameraSvc: CameraService,
    private userSvc: UserService,
    private router: Router) { }

  async ngOnInit() {

    this.getCasier();
    this.getCategorie();
    this.getFamille();
    this.getFournisseur()


    const memo = history.state as Produit;
    console.log(memo);

    this.produit = this.produitSvc.initProduitValues(memo);

    
    console.log(this.image?.photo.webPath);
    if(this.produit.imgLink){
      this.readImage(this.produit.imgLink!).then((val:string) =>{
        this.produit_img_data = val;
      });
    }
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();

    this.familles = await this.produitSvc.getFamilles();
    // if(this.familles.length < 1){
    //   setTimeout(()=>{
    //     this.router.navigate(["/add-update-famille/add"]);
    //   }, 1500);
    //   showToast('Veuillez paramétrer les familles de produit');
    //   return;
    // }
    this.casiers = await this.produitSvc.getCasier();
    // if(this.casiers.length < 1){
    //   showToast('Veuillez paramétrer les casiers');
    //   setTimeout(()=>{
    //     this.router.navigate(["/add-update-casier/add"]);
    //   }, 1500);
    //   return;
    // }
    this.categories = await this.produitSvc.getCategorie();
    // if(this.categories.length < 1){
    //   showToast('Veuillez paramétrer les catéfories de produit');
    //   setTimeout(()=>{
    //     this.router.navigate(["/add-update-categorie/add/produit"]);
    //   }, 1500);
    //   return;
    // }
    this.fournisseurs = await this.produitSvc.getFournisseur();
    // if(this.fournisseurs.length < 1){
    //   setTimeout(()=>{
    //     this.router.navigate(["/add-update-fournisseur/add"]);
    //   }, 1500);
    //   showToast('Veuillez paramétrer les fournisseurs');
    //   return;
    // }
    
  }

  initForm() {
      // console.log("update")
    this.produitForm = this.formBuilder.group({
      nom: [this.produit.nom || "", Validators.required],
      prixA: [this.produit.prixA || 0, Validators.required],
      prixV: [this.produit.prixV || 0, Validators.required],
      nbreBtleParCasier: [this.produit.nbreBtleParCasier ||  0, [Validators.required, Validators.min, Validators.max]],
      ristourne: [this.produit.ristourne || 0, [Validators.required, Validators.min, Validators.max]],
      id_categorie: [this.produit.id_categorie || "", Validators.required],
      id_famille: [this.produit.id_famille || "", Validators.required],
      id_casier: [this.produit.id_casier || "", Validators.required],
      _fournisseurs_ids: [this.produit._fournisseurs_ids || "", Validators.required],
      upload: [this.produit.upload || ""],
      imgLink: [this.produit.imgLink || ""],
      hasCasier: [!!this.produit.hasCasier || false, Validators.required]
    });
    console.log(this.produit._fournisseurs_ids)

  }

  // initProduitValues(memo:any): Produit{
  //   let produit = new Produit(memo.nom);
  //   produit.id = memo.id;
  //   produit.prixA = memo.prixA;
  //   produit.prixV = memo.prixV;
  //   produit.nbreBtleParCasier = memo.nbreBtleParCasier;
  //   produit.ristourne = memo.ristourne;
  //   produit.id_categorie = memo.id_categorie;
  //   produit.id_famille = memo.id_famille;
  //   produit.id_casier = memo.id_casier;
  //   produit.upload = memo.upload;
  //   produit.imgLink = memo.imgLink;
  //   produit.user_id = memo.user_id;
  //   produit.hasCasier = memo.hasCasier;
  //   produit.upload = memo.upload;
  //   produit.fournisseurs = memo.fournisseurs;
  //   produit.user_id = this.userSvc.getActiveUser()?.id;
  //   return produit;
  // }

  async submit() {
    // console.log(this.produitForm.value); return;
    if(this.produitForm.invalid) {
      this.showToast("Remplissez les champ!");
      return;
    }

    console.log(this.produitForm.value); 

    const formData = this.produitForm.value;

    let fournisseurAsTable: {id: number, nom: string}[] = [];

    // convert a list of id founisseur to a list of (id and nom)
    formData._fournisseurs_ids.forEach((id: string) => {
      let fourName = (this.fournisseurs.filter((f: Fournisseur) => f.id)[0] as Fournisseur).nom
      let val = {
        id: +id,
        nom: fourName
      }
      fournisseurAsTable.push(val)
    });

    formData._fournisseurs_ids = fournisseurAsTable;

    let newProduit : Produit = this.produitSvc.initProduitValues(formData);

    console.log('le new produit est : ',newProduit)

    if(this.image){
      let imgIsSaved = await this.saveImage(this.image);
      newProduit.imgLink = imgIsSaved?.filepath;
    }
    // console.log(newProduit); return;
    if(this.action === "update"){
      console.log("update")
      newProduit.id = this.produit.id;
      newProduit.deletedAt = this.produit.deletedAt;

      this.produitSvc.update(newProduit).then((val: any)=>{
        console.log(val)
        if(val){
          this.showToast("effectué")
          resetForm(this.produitForm);
          this.router.navigateByUrl("/produit")
        }
      }).catch((error:any)=> this.showToast("Veuillez réessayer"));

    }else{

      this.produitSvc.create(newProduit).then((val)=>{
        if(val){
          this.showToast("Nouveau element créer")
          resetForm(this.produitForm);
          this.router.navigateByUrl("/produit")
        }
      }).catch((error:any)=> this.showToast("Veuillez réessayer"));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la produit à votre application
  }

  modifierProduit() {
    const formData = this.produitForm.value;
    const produitModifiee = new Produit(formData.nom, formData.description, formData.deletedAt, formData.id);

    // Vous pouvez ajouter ici la logique pour modifier la Produit dans votre application
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
    this.produitForm.get('nbre_btle_par_produit')?.setValue(filteredValue);
  }

  private getFournisseur(): void{
    this.fournisseurSvc.fournisseurSubject.subscribe(
      {
        next: (val: Fournisseur[] | false)=>{
          if(val) this.fournisseurs = val
        },
        error: (err: Error) => console.log(err)
      }
    )
  }

  private getFamille(): void{
    this.familleSvc.familleSubject.subscribe(
      {
        next: (val: Famille[] | false)=>{
          if(val) this.familles = val
        },
        error: (err: Error) => console.log(err)
      }
    )
  }

  private getCasier(): void{
    this.casierSvc.casierSubject.subscribe(
      {
        next: (val: Casier[] | false)=>{
          if(val) this.casiers = val
        },
        error: (err: Error) => console.log(err)
      }
    )
  }

  private getCategorie(): void{
    this.categorieSvc.categorieSubject.subscribe(
      {
        next: (val: Categorie[] | false)=>{
          if(val) this.categories = val
        },
        error: (err: Error) => console.log(err)
      }
    )
  }

  image!: ImageStruct | null;
  async takeImage(): Promise<void>{
    this.image = await this.cameraSvc.takePhoto();
  }

  async saveImage(image:ImageStruct): Promise<{ filepath: string, webviewPath: string } | null>{
    if(image){
      return await this.cameraSvc.saveImageToMemory(image?.photo);
    }
    return null
  }

  async readImage(imageName: string):Promise<string>{
    let image: ReadFileResult = await this.cameraSvc.readPhoto(imageName);
    return 'data:image/jpeg;base64,'+image.data as string || '' 
  }

}



