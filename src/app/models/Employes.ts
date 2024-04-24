export class    Employe{
    constructor(
      public nom: string,
      public user_id?: number,
      public adresse?: string,
      public phone1?: string,
      public cni?: string,
      public photo?: string,
      public deletedAt?: number, // type timestamp
      public id?:number,
      ){
        this.deletedAt = 0;
        this.user_id = 15;
      }
}

