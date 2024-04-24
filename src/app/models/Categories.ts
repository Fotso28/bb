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
        this.user_id = 15;
      }
}

export type CategorieType =  'produit' | 'depense';

