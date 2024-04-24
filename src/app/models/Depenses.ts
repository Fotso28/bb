export class Depense{
    constructor(
      public date?: number,
      public type?: string,
      public motif?: string,
      public montant?: number,
      public user_id?: number,
      public point_vente_id?: number,
      public deletedAt?: number,
      public id?:number,
      ){
        this.montant = 0;
        this.point_vente_id = 1;
        this.deletedAt = 0
        this.user_id = 15;
      }
}