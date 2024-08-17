import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('PointVente')
export class PointVente{
    constructor(
      public nom: string,
      public adresse?: string,
      public description?: string,
      public user_id?: number,
      public deletedAt?: number, // type timestamp
      public id?:number,
      ){
        this.deletedAt = 0;
        this.user_id = 15;
      }
}