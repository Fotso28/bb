import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('CasierSup')
export class CasierSup{
    constructor(
      public type?: "E" | "S",
      public nbre_bouteille?: number,
      public id_casier?: number,
      public id?:number,
      public user_id?: number
      ){
        this.user_id = 15;
      }
}