import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { SyncDatabaseService } from 'src/app/services/backup.service';
import { PointVenteService } from 'src/app/services/point-vente.service';

@Component({
  selector: 'app-folder',
  templateUrl: './accueil.page.html',
  styleUrls: ['./accueil.page.scss'],
})
export class AcceuilPage implements OnInit {
  @ViewChild('pointVenteComponent') pointVenteComponent: any;
  constructor(private menuCtrl: MenuController,private pvSvc: PointVenteService, private syncData : SyncDatabaseService) {}

  async ngOnInit() {
    // this.syncData.upload();
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
}