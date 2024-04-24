import { Injectable } from '@angular/core';
import { Employe } from '../models/Employes';
import { BdService } from './-bd.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeService {

  employeSubject: BehaviorSubject<Employe[]> = new BehaviorSubject<Employe[]>([]);

  constructor(private bdSvc: BdService){}
  
  async create(item: Employe): Promise<boolean> {
    try {
        let itemsIsReaded = await this.bdSvc.create(item);
        if(itemsIsReaded) this.getAll();
        return itemsIsReaded;
      } catch (error) {
        console.log(error);
        return false;
    }
  }

  async read(id: number): Promise<boolean> {
    try {
      let itemIsReaded: boolean = await this.bdSvc.read('Famille',id);
      if(itemIsReaded) this.getAll();
      return itemIsReaded;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  async update(item: Employe): Promise<boolean> {
    try {
      let itemIsUpdated: boolean = await this.bdSvc.update(item);
      if(itemIsUpdated) this.getAll();
      return itemIsUpdated;
    } catch (error) {
      console.log(error);
      return false
    }
  }

  async delete(item: Employe): Promise<boolean> {
    try {
      let itemIsDeleted: boolean = await this.bdSvc.delete(item);
      if(itemIsDeleted) this.getAll();
      return itemIsDeleted;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async getAll(): Promise<boolean> {
    try {
      let all = await this.bdSvc.readAll('Employe') as Array<Employe>;
      this.employeSubject.next(all);
      return true
    } catch (error) {
      console.log(error);
      return true;
    }
  }

  hydrateEmploye(item:any): Employe{
    let employe: Employe = new Employe(item.nom);
    if(item.id) employe.id = item.id;

    
    if(item.adresse) employe.adresse = item.adresse;
    if(item.phone1) employe.phone1 = item.phone1;
    if(item.cni) employe.cni = item.cni;
    if(item.photo) employe.photo = item.photo;
    if(item.deletedAt) employe.deletedAt = item.deletedAt;
    return employe;
  }
}
