import { Component, OnInit } from '@angular/core'; 
import { ActionSheetButton, ActionSheetController, IonRouterOutlet, Platform } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { BdService } from './services/-bd.service';
import { UserService } from './services/user.service';
import { PointVente } from './models/PointVentes';
import { PointVenteService } from './services/point-vente.service';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';
import { AuthService } from './services/auth.service';
import { DataInitializationService } from './services/data-initialization.service';
import { showError, showToast } from './_lib/lib';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public menuSection = ['Menu', 'Métiers', 'Statistiques', 'Paramètres', 'Sauvegardes', 'Aide'];
  public appPages = [
    { title: 'Tableau de bord', url: '/', icon: 'dashboard', categorie: 'Menu' },
    { title: 'Ravitaillements', url: '/list-ravitaillement', icon: 'restock' , categorie: 'Métiers'},
    { title: 'Inventaires', url: '/list-inventory', icon: 'accounting' , categorie: 'Métiers'},
    { title: 'Avaris', url: '/avaris', icon: 'damaged' , categorie: 'Métiers'},
    { title: 'Dépenses', url: '/depense', icon: 'damaged' , categorie: 'Métiers'},
    { title: 'Ristournes', url: '/ristourne', icon: 'refund' , categorie: 'Statistiques'},
    { title: 'Produits', url: '/produit', icon: 'bouteille' , categorie: 'Paramètres'},
    { title: 'Partenaires', url: '/fournisseur', icon: 'supplier' , categorie: 'Paramètres'},
    { title: 'Points de vente', url: '/point-vente', icon: 'home' , categorie: 'Paramètres'},
    { title: 'Casiers', url: '/casier', icon: 'crate' , categorie: 'Paramètres'},
    { title: 'Employes', url: '/employe', icon: 'employers' , categorie: 'Paramètres'},
    { title: 'Categories Produit', url: '/categorie/produit', icon: 'categorize_produit' , categorie: 'Paramètres'},
    { title: 'Categories Dépense', url: '/categorie/depense', icon: 'categorize_depense' , categorie: 'Paramètres'},
    { title: 'Familles', url: '/famille', icon: 'famille' , categorie: 'Paramètres'},
    { title: 'Sauvegarder vos données', url: '/sauvegarde', icon: 'famille' , categorie: 'Sauvegardes'},
    { title: 'A Propos', url: '/', icon: 'information-circle-outline' , categorie: 'Aide'},
    { title: 'Contacts', url: '/', icon: 'call-outline' , categorie: 'Aide'},
  ];
  
  constructor(private router: Router,
    private platform: Platform, 
    private dbSvc: BdService,
    private actionSheetCtrl: ActionSheetController,
    private dataInit: DataInitializationService,
    private authSvc: AuthService) 
  {
    register();
    this.platform.ready().then(async() => {
      // localStorage.clear();
      if (this.platform.is('capacitor')) {
        StatusBar.setOverlaysWebView({ overlay: false });
        StatusBar.setBackgroundColor({ color: "#50c8ff" });
        
        // this.router.navigateByUrl("/loading-page")
        
        
        // this.fcmNotification.init_fcm_push_notification();
      }
    })
    
  }
  
  ngAfterContentInit(){
    // this.router.navigateByUrl('/loading-page');
    
  }
  
  async ngOnInit(): Promise<any> {
    await this.dataInit.initializeApp();
    if(await this.authSvc.isAuthenticated()){
      this.dbSvc.loadData();
    }
    console.warn((await this.dbSvc.getActiveUser()));
  }

  async logout(){
    let role = await this.confirm();
    if(role == "confirm"){
      await this.dataInit.clearParamsData();
      this.router.navigateByUrl("/login");
      showToast("Vous êtes deconnectés! A bientôt")
    }
  }

  async confirm(){

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Deconnexion',
      subHeader: "Etes vous sûr ?",
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
