import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('Depense')
export class Depense{
    constructor(
      public date?: number,
      public type?: number,
      public motif?: string,
      public montant?: number,
      public user_id?: number,
      public id_point_vente?: number,
      public deletedAt?: number,
      public id?:number,
      ){
        this.montant = 0;
        this.deletedAt = 0
      }
}