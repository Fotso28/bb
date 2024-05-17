export class Vente{
    public id!: number;
    public total!: number;
    public versement!: number;
    public ids_employe!: string;
    public user_id!: number;
    public id_point_vente!: number;
    public ids_ravitaillement!: string;
    constructor(public date?: number, public produits?: string){}
}