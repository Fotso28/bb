import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Inbox',
    pathMatch: 'full'
  },
  {
    path: 'folder/Inbox',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'famille',
    loadChildren: () => import('./pages/familles/famille/famille.module').then( m => m.FamillePageModule)
  },
  {
    path: 'add-update-famille/:action',
    loadChildren: () => import('./pages/familles/add-update-famille/add-update-famille.module').then( m => m.AddUpdateFamillePageModule)
  },
  {
    path: 'casier',
    loadChildren: () => import('./pages/casiers/casier/casier.module').then( m => m.CasierPageModule)
  },
  {
    path: 'add-update-casier/:action',
    loadChildren: () => import('./pages/casiers/add-update-casier/add-update-casier.module').then( m => m.AddUpdateCasierPageModule)
  },
  {
    path: 'categorie/:type',
    loadChildren: () => import('./pages/categories/categorie/categorie.module').then( m => m.CategoriePageModule)
  },
  {
    path: 'add-update-categorie/:action/:type',
    loadChildren: () => import('./pages/categories/add-update-categorie/add-update-categorie.module').then( m => m.AddUpdateCategoriePageModule)
  },
  {
    path: 'add-update-employe/:action',
    loadChildren: () => import('./pages/employes/add-update-employe/add-update-employe.module').then( m => m.AddUpdateEmployePageModule)
  },
  {
    path: 'employe',
    loadChildren: () => import('./pages/employes/employe/employe.module').then( m => m.EmployePageModule)
  },
  {
    path: 'point-vente',
    loadChildren: () => import('./pages/pointVentes/point-vente/point-vente.module').then( m => m.PointVentePageModule)
  },
  {
    path: 'add-update-point-vente/:action',
    loadChildren: () => import('./pages/pointVentes/add-update-point-vente/add-update-point-vente.module').then( m => m.AddUpdatePointVentePageModule)
  },
  {
    path: 'fournisseur',
    loadChildren: () => import('./pages/fournisseurs/fournisseur/fournisseur.module').then( m => m.FournisseurPageModule)
  },
  {
    path: 'add-update-fournisseur/:action',
    loadChildren: () => import('./pages/fournisseurs/add-update-fournisseur/add-update-fournisseur.module').then( m => m.AddUpdateFournisseurPageModule)
  },
  {
    path: 'produit',
    loadChildren: () => import('./pages/produits/produit/produit.module').then( m => m.ProduitPageModule)
  },
  {
    path: 'add-update-produit/:action',
    loadChildren: () => import('./pages/produits/add-update-produit/add-update-produit.module').then( m => m.AddUpdateProduitPageModule)
  },
  {
    path: 'add-update-avaris/:action',
    loadChildren: () => import('./pages/avaris/add-update-avaris/add-update-avaris.module').then( m => m.AddUpdateAvarisPageModule)
  },
  {
    path: 'avaris',
    loadChildren: () => import('./pages/avaris/avaris/avaris.module').then( m => m.AvarisPageModule)
  },
  {
    path: 'add-update-depense/:action',
    loadChildren: () => import('./pages/depenses/add-update-depense/add-update-depense.module').then( m => m.AddUpdateDepensePageModule)
  },
  {
    path: 'depense',
    loadChildren: () => import('./pages/depenses/depense/depense.module').then( m => m.DepensePageModule)
  },
  {
    path: 'ravitaillement-fournisseur-step',
    loadChildren: () => import('./pages/ravitaillements/1_ravitaillement-fournisseur-step/ravitaillement-fournisseur-step.module').then( m => m.RavitaillementFournisseurStepPageModule)
  },
  {
    path: 'ravitaillement-produit-step',
    loadChildren: () => import('./pages/ravitaillements/2_ravitaillement-produit-step/ravitaillement-produit-step.module').then( m => m.RavitaillementProduitStepPageModule)
  },
  {
    path: 'ravitaillement-emballage-step',
    loadChildren: () => import('./pages/ravitaillements/3_ravitaillement-emballage-step/ravitaillement-emballage-step.module').then( m => m.RavitaillementEmballageStepPageModule)
  },
  {
    path: 'ravitaillement-confirmation-step',
    loadChildren: () => import('./pages/ravitaillements/4_ravitaillement-confirmation-step/ravitaillement-confirmation-step.module').then( m => m.RavitaillementConfirmationStepPageModule)
  },
  {
    path: 'add-produit/:action',
    loadChildren: () => import('./pages/ravitaillements/2_ravitaillement-produit-step/add-produit/add-produit.module').then( m => m.AddProduitPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
