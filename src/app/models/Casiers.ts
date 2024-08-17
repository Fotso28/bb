import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('Casier')
export class Casier{
    constructor(
      public nom?: string,
      public nbre_btle_par_casier?: number,
      public user_id?: number,
      public description?: string,
      public deletedAt?: number, // type timestamp
      public id?:number,
      ){
        this.nbre_btle_par_casier = 0
        this.deletedAt = 0;
      }
}