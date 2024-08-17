import { Component, OnInit } from '@angular/core'; 
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { BdService } from './services/-bd.service';
import { UserService } from './services/user.service';
import { PointVente } from './models/PointVentes';
import { PointVenteService } from './services/point-vente.service';
import { Router } from '@angular/router';
import { StatusBar } from '@capacitor/status-bar';


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
  
  constructor(private router: Router,private platform: Platform, private dbSvc: BdService, private userSvc: UserService, private pvSvc: PointVenteService) 
  {
    register();
    this.platform.ready().then(() => {

      if (this.platform.is('capacitor')) {
        StatusBar.setOverlaysWebView({ overlay: false });
        StatusBar.setBackgroundColor({ color: "#50c8ff" });
         this.initializeApp();
        // this.fcmNotification.init_fcm_push_notification();
      }
    })
    
  }
  
  ngAfterContentInit(){
    // this.router.navigateByUrl('/loading-page');
  }
  
  async ngOnInit(): Promise<any> {
    
  }

  async initializeApp(){
    if(this.platform.is('capacitor')){
      await this.dbSvc.initDatabase()
    }

    if(!this.userSvc.getActiveUser()){
      this.userSvc.setActiveUser({ id: 1, username: 'Test User', telephone: '699658838', localite: "", token: "jtkls" })
    }
    
    await this.activePointVente();
  }

  async activePointVente(){

    let activePv : PointVente | null = this.pvSvc.getActivePointeVente();
    console.warn(activePv)
    if(activePv){
      return
    }

    // Aucun pv activer
    let allPv : Array<PointVente> = await this.pvSvc.all();
    if(allPv && allPv.length){
      const FIRST_ELEMENT = 0
      this.pvSvc.setActivePointVente(allPv[FIRST_ELEMENT])
    }else{
      // this.router.navigateByUrl('/add-update-point-vente/add');
    }
  }
}
