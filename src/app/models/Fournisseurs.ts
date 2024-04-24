export class Fournisseur{
    constructor(
      public nom: string,
      public user_id?: number,
      public adresse?: string,
      public phone1?: string,
      public collecte_ristourne?: boolean,
      public photo?: string,
      public deletedAt?: number, // type timestamp
      public id?:number,
      ){
        this.deletedAt = 0;
        this.user_id = 15;
        this.collecte_ristourne = false
      }
}