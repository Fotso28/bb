import { ClassName } from "../_decorators/class-name.decorator";

@ClassName('Vente')
export class Vente{
    public id!: number;
    public total!: number;
    public versement!: number;
    public ids_employe!: string;
    public user_id!: number;
    public id_point_vente!: number;
    public ids_ravitaillement!: string;
    public id_reste!: number; // reste au moment de faire les compte
    public id_lastStock!: number; // stock present avant les ravitaillements
    constructor(public date?: number, public produits?: string){}
}