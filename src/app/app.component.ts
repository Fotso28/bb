import { Component, OnInit } from '@angular/core'; 
import { Platform } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { BdService } from './services/-bd.service';
import { UserService } from './services/user.service';
import { PointVente } from './models/PointVentes';
import { PointVenteService } from './services/point-vente.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  public appPages = [
    { title: 'Partenaires', url: '/fournisseur', icon: 'archive' },
    { title: 'Ravitaillement', url: '/ravitaillement-fournisseur-step', icon: 'archive' },
    { title: 'Inventaire', url: '/list-inventory', icon: 'archive' },
    { title: 'Produit', url: '/produit', icon: 'trash' },
    { title: 'Point de vente', url: '/point-vente', icon: 'warning' },
    { title: 'Casier', url: '/casier', icon: 'warning' },
    { title: 'Employe', url: '/employe', icon: 'warning' },
    { title: 'Categorie Produit', url: '/categorie/produit', icon: 'warning' },
    { title: 'Categorie Dépense', url: '/categorie/depense', icon: 'warning' },
    { title: 'Categorie Dépense', url: '/categorie/depense', icon: 'warning' },
    { title: 'Famille', url: '/famille', icon: 'warning' }
  ];
  
  constructor(private router: Router,private platform: Platform, private dbSvc: BdService, private userSvc: UserService, private pvSvc: PointVenteService) {
    register();
  }

  async ngOnInit(): Promise<any> {
    if(!this.userSvc.getActiveUser()){
      this.userSvc.setActiveUser({ id: 1, name: 'Test User', age: 30 })
    }
    
    if(this.platform.is('capacitor')){
      await this.dbSvc.initDatabase()
    }

    this.activePointVente();
  }

  async activePointVente(){
    
    let activePv : PointVente | null = this.pvSvc.getActivePointeVente();
    console.warn(activePv)
    if(activePv){
      return
    }

    // Aucun pv activer
    let allPv : Array<PointVente> = await this.pvSvc.all();
    if(allPv.length){
      const FIRST_ELEMENT = 0
      this.pvSvc.setActivePointVente(allPv[FIRST_ELEMENT])
    }else{
      // this.router.navigateByUrl('/add-update-point-vente/add');
    }
  }
}
