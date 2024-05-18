import { Component, OnInit } from '@angular/core';
import { Vente } from 'src/app/models/ProduitVendus';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.page.html',
  styleUrls: ['./list-inventory.page.scss'],
})
export class ListInventoryPage implements OnInit {

  inventaires!: Vente[];
  constructor(private inventorySvc: InventoryService) { }

  async ngOnInit() {
    this.inventaires = (await this.getInventory()).values as Vente[]
  }

  async getInventory(){
    return await this.inventorySvc.getInventory();
  }
}
