import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PointVente } from 'src/app/models/PointVentes';
import { BdService } from 'src/app/services/-bd.service';
import { SyncDatabaseService } from 'src/app/services/backup.service';
import { DataInitializationService } from 'src/app/services/data-initialization.service';
import { PointVenteService } from 'src/app/services/point-vente.service';

@Component({
  selector: 'app-folder',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
})
export class AcceuilPage implements OnInit {
  @ViewChild('pointVenteComponent') pointVenteComponent: any;
  constructor(private menuCtrl: MenuController,private pvSvc: PointVenteService, private dbSvc: BdService,
    private dataInit: DataInitializationService,
  ) {}

  async ngOnInit() {
    // await this.bdSvc.setActiveUser(response);
    // console.log("voici les users : ", await this.dbSvc.getActiveUser());
  }
  /**
   * Open menu
   */
  openMenu(){
    this.menuCtrl.open('main-menu');
  }

  openPointVente(){
    this.pointVenteComponent.openModal()
  }

  ionViewWillEnter(){
    let pointVente: PointVente | null = this.pvSvc.getActivePointeVente();
    if (this.pointVenteComponent) {
      this.pointVenteComponent.ngOnInit(); // Méthode pour rafraîchir les données
    }

    const now: Date = new Date();
    const currentDate: string = now.toISOString().split('T')[0]; // Format YYYY-MM-DD
    console.log('Current Date:', currentDate);
  }
}