import { Component, OnInit, ViewChild, numberAttribute } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadFileResult } from '@capacitor/filesystem';
import { ActionSheetController, AlertController, IonInput, IonSelect, ToastController } from '@ionic/angular';
import { MIN_QTY_LENGHT } from 'src/app/_lib/const';
import { resetForm, showToast, trimAndParseInt } from 'src/app/_lib/lib';
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

  @ViewChild("categorieElt", { static: false }) categorieElt! : IonSelect;
  @ViewChild("fournisseurElt", { static: false }) fournisseurElt! : IonSelect;
  @ViewChild("familleElt", { static: false }) familleElt! : IonSelect;
  @ViewChild("casierElt", { static: false }) casierElt! : IonSelect;

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
    private alertController: AlertController,
    private actionSheetCtrl: ActionSheetController,
    private router: Router) { }

  async ngOnInit() {

    this.getCasier();
    this.getCategorie();
    this.getFamille();
    this.getFournisseur()


    const memo = history.state as Produit;
    console.log(memo);

    this.produit = this.produitSvc.initProduitValues(memo);

    
    this.action = this.route.snapshot.paramMap.get('action') as 'update' | 'add';
    this.initForm();
    if(this.produit.imgLink){
      console.log(this.produit.imgLink);
      if(/\.jpeg$/.test(this.produit.imgLink) && !/assets\/product-img\//.test(this.produit.imgLink)){
        this.produit.imgLink = await this.readImage(this.produit.imgLink!)
      }
      this.produit_img_data = this.produit.imgLink;
    }

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

    console.log(this.produit)

    this.displayOnModal(this.produit.id_categorie, this.produit.id_casier, this.produit.id_famille,this.produit._fournisseurs_ids)
    
  }

  initForm() {
      // console.log("update")
    this.produitForm = this.formBuilder.group({
      nom: [this.produit.nom || "", Validators.required],
      prixA: [this.produit.prixA?.toString() || '0', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9\s]+$/)]],
      prixV: [this.produit.prixV?.toString() || '0', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9\s]+$/)]],
      nbreBtleParCasier: [this.produit.nbreBtleParCasier?.toString() ||  '0', [Validators.required, Validators.min(1), Validators.pattern(/^[0-9\s]+$/)]],
      ristourne: [this.produit.ristourne?.toString() || '0', [Validators.required, Validators.min(0), Validators.pattern(/^[0-9\s]+$/)]],
      id_categorie: [this.produit.id_categorie || "", Validators.required],
      id_famille: [this.produit.id_famille || "", Validators.required],
      id_casier: [this.produit.id_casier || "", Validators.required],
      _fournisseurs_ids: [this.produit._fournisseurs_ids || "", Validators.required],
      upload: [this.produit.upload || ""],
      imgLink: [this.produit.imgLink || ""],
      hasCasier: [this.produit.hasCasier == undefined ? true : this.produit.hasCasier, Validators.required]
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
    console.log(this.action)
    if(this.produitForm.invalid) {
      this.produitForm.markAllAsTouched();
      showToast("Remplissez les champ!", 'danger');
      return;
    }

    console.log(this.produitForm.value); 

    const formData = this.produitForm.value;
    
    
    formData.prixA = trimAndParseInt(formData.prixA);
    formData.prixV = trimAndParseInt(formData.prixV);
    formData.ristourne = trimAndParseInt(formData.ristourne);
    formData.nbreBtleParCasier = trimAndParseInt(formData.nbreBtleParCasier);
    console.log(formData); 
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
        console.log(this.image, 'je suis entree')
        let imgIsSaved = await this.saveImage(this.image);
        newProduit.imgLink = imgIsSaved?.filepath;
    }
    // return;
    // console.log(newProduit); return;
    if(this.action === "update"){
        console.log("update")
        newProduit.id = this.produit.id;
        newProduit.deletedAt = this.produit.deletedAt;

      this.produitSvc.update(newProduit).then((val: any)=>{
        console.log(val)
        if(val){
          showToast("effectué")
          resetForm(this.produitForm);
          this.router.navigateByUrl("/produit")
        }
      }).catch((error:any)=> showToast("Veuillez réessayer", 'danger'));

    }else{

      this.produitSvc.create(newProduit).then((val)=>{
        if(val){
          showToast("Nouveau element créer")
          resetForm(this.produitForm);
          this.router.navigateByUrl("/produit")
        }
      }).catch((error:any)=> showToast("Veuillez réessayer", 'danger'));

    }
    // Vous pouvez ajouter ici la logique pour ajouter la produit à votre application
  }

  modifierProduit() {
    const formData = this.produitForm.value;
    const produitModifiee = new Produit(formData.nom, formData.description, formData.deletedAt, formData.id);

    // Vous pouvez ajouter ici la logique pour modifier la Produit dans votre application
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
    if(imageName){
      let image: ReadFileResult = await this.cameraSvc.readPhoto(imageName);
      return 'data:image/jpeg;base64,'+image.data as string || '' 
    }
    return '';
  }

  async removeImage(){
    let role = await this.confirm();
    if(role == "confirm"){
        this.image = null;
        this.produit_img_data = "";
        this.produit.imgLink = "";
        this.produitForm.patchValue({imgLink: ""})
    }
  }

  openModal(modalType: "fournisseur"| "famille" | "casier" | "categorie"){
    
    if(modalType == 'fournisseur'){
      if(this.fournisseurs.length){
        this.fournisseurElt.open();
        return;
      }else{
        this.presentAlert("/add-update-fournisseur/add", "Aucun fournisseur de produit n'a été crée!", "Créer un Fournisseur")
      }
    }

    if(modalType == 'famille'){
      if(this.familles.length){
        this.familleElt.open();
        return;
      }else{
        this.presentAlert("/add-update-famille/add", "Aucune famille de produit n'a été crée!", "Créer une Famille")
      }
    }

    if(modalType == 'casier'){
      
      if(this.casiers.length){
        this.casierElt.open();
        return;
      }else{
        this.presentAlert("/add-update-casier/add", "Aucun Type de casier n'a été crée!", "Créer Casier")
      }
    }

    if(modalType == 'categorie'){
      if(this.categories.length){
        this.categorieElt.open();
        return;
      }else{
        this.presentAlert("/add-update-categorie/add/produit", "Aucune catégorie n'a été créee!", "Créer Catégorie")
      }
    }
  }

  // juste pour afficher les modals
  categorie: any;
  fournisseur: any = [];
  casier: any;
  famille: any;
  valueChange(event: Event, modalType: "fournisseur"| "famille" | "casier" | "categorie"){
    
    if(modalType == "categorie"){
      let _categorie = this.categories.filter((cat:Categorie) => cat.id == (event as CustomEvent).detail.value) ;
      if(_categorie.length){
        this.categorie = _categorie[0];
      }
    }

    if(modalType == "fournisseur"){
      let _fournisseur = this.fournisseurs.filter((fournisseur:Fournisseur) => (event as CustomEvent).detail.value.includes(fournisseur.id)) ;
      if(_fournisseur.length){
        this.fournisseur = _fournisseur;
      }
    }

    if(modalType == "casier"){
      let _casier = this.casiers.filter((casier:Casier) => casier.id == (event as CustomEvent).detail.value) ;
      if(_casier.length){
        this.casier = _casier[0];
      }
    }

    if(modalType == "famille"){
      let _famille = this.familles.filter((famille:Famille) => famille.id == (event as CustomEvent).detail.value) ;
      if(_famille.length){
        this.famille = _famille[0];
      }
    }
  }

  displayOnModal(id_categorie: any, id_casier: any, id_famille: any, _fournisseurs_ids: Array<any>){
    console.warn(this.categories, id_categorie)
    if(id_categorie){
      let _categorie = this.categories.filter((cat:Categorie) => cat.id == id_categorie) ;
      if(_categorie.length){
        this.categorie = _categorie[0];
      }
    }
    // else{
    //   if(this.categories.length){
    //     this.categorie = this.categories[0];
    //   }
    // }
    console.log(this.categorie)
    if(_fournisseurs_ids.length){
      let _fournisseur = this.fournisseurs.filter((fournisseur:Fournisseur) => _fournisseurs_ids.includes(fournisseur.id!)) ;
      if(_fournisseur.length){
        this.fournisseur = _fournisseur;
      }
    }
    // else{
    //   if(this.fournisseurs.length){
    //     this.fournisseur = this.fournisseurs[0];
    //     console.warn(this.fournisseurs)
    //   }
    // }

    if(id_casier){
      let _casier = this.casiers.filter((casier:Casier) => casier.id == id_casier) ;
      if(_casier.length){
        this.casier = _casier[0];
      }
    }
    // else{
    //   if(this.casiers.length){
    //     this.casier = this.casiers[0];
    //   }
    // }

    if(id_famille){
      let _famille = this.familles.filter((famille:Famille) => famille.id == id_famille) ;
      if(_famille.length){
        this.famille = _famille[0];
      }
    }
    // else{
    //   if(this.familles.length){
    //     this.famille = this.familles[0];
    //   }
    // }
  }

  async presentAlert(endpoint: string, message: string, subHeader: string ="", header: string = "") {
    const alert = await this.alertController.create({
      header,
      subHeader,
      message,
      mode: "ios",
      buttons: [
        {
          text: 'Créer',
          handler: () => {
            this.router.navigateByUrl(endpoint);
          }
        }
      ]
    });

    await alert.present();
  }

  async confirm(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Voulez vous supprimer cet image ?',
      mode: 'ios',
      buttons: [
        {
          text: 'Oui',
          role: 'confirm',
        },
        {
          text: 'Non',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role;
  }

}