import { Component, OnInit } from '@angular/core';
import { InventoryService } from 'src/app/services/inventory.service';

@Component({
  selector: 'app-list-inventory',
  templateUrl: './list-inventory.page.html',
  styleUrls: ['./list-inventory.page.scss'],
})
export class ListInventoryPage implements OnInit {

  constructor(private inventorySvc: InventoryService) { }

  async ngOnInit() {
    console.log(await this.getInventory())
  }

  async getInventory(){
    return await this.inventorySvc.getInventory();
  }
}
