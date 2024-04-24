import { Component, OnInit } from '@angular/core'; 
import { Platform } from '@ionic/angular';
import { register } from 'swiper/element/bundle';
import { BdService } from './services/-bd.service';
import { UserService } from './services/user.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  
  public appPages = [
    { title: 'Partenaires', url: '/fournisseur', icon: 'archive' },
    { title: 'Ravitaillement', url: '/ravitaillement-fournisseur-step', icon: 'archive' },
    { title: 'Produit', url: '/produit', icon: 'trash' },
    { title: 'Point de vente', url: '/point-vente', icon: 'warning' },
    { title: 'Casier', url: '/casier', icon: 'warning' },
    { title: 'Employe', url: '/employe', icon: 'warning' },
    { title: 'Categorie Produit', url: '/categorie/produit', icon: 'warning' },
    { title: 'Categorie Dépense', url: '/categorie/depense', icon: 'warning' },
    { title: 'Categorie Dépense', url: '/categorie/depense', icon: 'warning' },
    { title: 'Famille', url: '/famille', icon: 'warning' }
  ];
  
  constructor(private platform: Platform, private dbSvc: BdService, private userSvc: UserService) {
    register();
  }

  async ngOnInit(): Promise<any> {
    if(!this.userSvc.getActiveUser()){
      this.userSvc.setActiveUser({ id: 1, name: 'Test User', age: 30 })
    }
    
    if(this.platform.is('capacitor')){
      await this.dbSvc.initDatabase()
    }
  }
}
