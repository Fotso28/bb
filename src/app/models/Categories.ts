import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('Categorie')
export class Categorie{
    constructor(
      public nom: string,
      public user_id?: number,
      public description?: string,
      public deletedAt?: number, // type timestamp
      public type?: 'produit' | 'depense',
      public id?:number,
      ){
        this.deletedAt = 0;
      }
}

export type CategorieType =  'produit' | 'depense';

