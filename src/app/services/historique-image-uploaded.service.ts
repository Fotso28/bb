import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueImageUploadedService {
  private dbName = 'historique';
  constructor() { }

  public getHistorique(): Historique[]{
    let historique = localStorage.getItem(this.dbName);
    if(historique){
      return JSON.parse(historique) as Historique[];
    }
    return []
  }

  public setHistorique(imageName: string): void{
    if(imageName){
      let historique: Historique[] = this.getHistorique();
      let newData: Historique[] = [...historique, {imageName}]
      localStorage.setItem(this.dbName, JSON.stringify(newData));
    }
  }

  public imageExist(imageName: string): boolean{
    let historique: Historique[] = this.getHistorique();
    if(historique.length){
      return historique.some((historique: Historique) => historique.imageName == imageName);
    }else{
      return false
    }
  }
}

interface Historique{
  imageName: string
}
