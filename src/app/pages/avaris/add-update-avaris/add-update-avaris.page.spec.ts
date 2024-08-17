import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ToastController, IonModal, IonSelect } from '@ionic/angular';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AddUpdateAvarisPage } from './add-update-avaris.page';
import { AvarisService } from 'src/app/services/avaris.service';
import { CameraService } from 'src/app/services/camera.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { Avaris } from 'src/app/models/Avaris';
import { Produit } from 'src/app/models/Produits';
import { Reste } from 'src/app/models/RestesModel';
import { Ravitaillement } from 'src/app/models/Ravitaillements';
import { ProduitsRavitailles } from 'src/app/models/ProduitsRavitailles';
import { showToast, showError, resetForm } from 'src/app/_lib/lib';

describe('AddUpdateAvarisPage', () => {
  let component: AddUpdateAvarisPage;
  let fixture: ComponentFixture<AddUpdateAvarisPage>;
  let avarisSvcSpy: jasmine.SpyObj<AvarisService>;
  let cameraSvcSpy: jasmine.SpyObj<CameraService>;
  let inventorySvcSpy: jasmine.SpyObj<InventoryService>;
  let pointVenteSvcSpy: jasmine.SpyObj<PointVenteService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let toastCtrlSpy: jasmine.SpyObj<ToastController>;

  beforeEach(async () => {
    avarisSvcSpy = jasmine.createSpyObj('AvarisService', ['getProduit', 'hydrateAvaris', 'getAllUninventoryArarisPerProduct', 'create', 'update']);
    cameraSvcSpy = jasmine.createSpyObj('CameraService', ['readPhoto']);
    inventorySvcSpy = jasmine.createSpyObj('InventoryService', ['getLastStock', 'getUninventoryRavitaillements', 'extractProductFromRavitaillement']);
    pointVenteSvcSpy = jasmine.createSpyObj('PointVenteService', ['getActivePointeVente']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    toastCtrlSpy = jasmine.createSpyObj('ToastController', ['create']);

    await TestBed.configureTestingModule({
      declarations: [ AddUpdateAvarisPage ],
      imports: [ 
        IonicModule.forRoot(), 
        ReactiveFormsModule, 
        FormsModule 
      ],
      providers: [
        { provide: AvarisService, useValue: avarisSvcSpy },
        { provide: CameraService, useValue: cameraSvcSpy },
        { provide: InventoryService, useValue: inventorySvcSpy },
        { provide: PointVenteService, useValue: pointVenteSvcSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastController, useValue: toastCtrlSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdateAvarisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct action and produits', async () => {
    const mockProduits: Produit[] = [{qte: 0 , deletedAt : 0, id: 19, imgLink: "assets/product-img/preconfig-whisky-black.jpeg", nbreBtleParCasier: 6, nom: "Black & White", prixA:  48000, prixV: 60000 , ristourne: 0, upload:  "",user_id : 1,fournisseurs: "[{\"id\":2,\"nom\":\"Guinness Cameroun\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]",  hasCasier: false,  id_casier: '1', id_categorie: '2', id_famille: '2', _fournisseurs: [{id: 1, nom: "toto"}], _fournisseurs_ids:[1,2]}];
    avarisSvcSpy.getProduit.and.returnValue(Promise.resolve(mockProduits));
    avarisSvcSpy.hydrateAvaris.and.returnValue(new Avaris());
    pointVenteSvcSpy.getActivePointeVente.and.returnValue({ id: 1, nom: "Principale" });
    
    await component.ngOnInit();

    expect(component.produits).toEqual(mockProduits);
    expect(component.action).toBe('add');
  });

  it('should parse image links correctly', async () => {
    const mockProduits: Produit[] = [{qte: 0 , deletedAt : 0, id: 19, imgLink: "assets/product-img/preconfig-whisky-black.jpeg", nbreBtleParCasier: 6, nom: "Black & White", prixA:  48000, prixV: 60000 , ristourne: 0, upload:  "",user_id : 1,fournisseurs: "[{\"id\":2,\"nom\":\"Guinness Cameroun\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]",  hasCasier: false,  id_casier: '1', id_categorie: '2', id_famille: '2', _fournisseurs: [{id: 1, nom: "toto"}], _fournisseurs_ids:[1,2]}];
    avarisSvcSpy.getProduit.and.returnValue(Promise.resolve(mockProduits));
    const parsedProduits = await component.parseProduitImage(mockProduits);
    expect(parsedProduits[0].imgLink).toBe('assets/product-img/image1.jpeg');
  });

  it('should handle form submission for adding a new avaris', async () => {
    const mockProduit: Produit = {qte: 0 , deletedAt : 0, id: 19, imgLink: "assets/product-img/preconfig-whisky-black.jpeg", nbreBtleParCasier: 6, nom: "Black & White", prixA:  48000, prixV: 60000 , ristourne: 0, upload:  "",user_id : 1,fournisseurs: "[{\"id\":2,\"nom\":\"Guinness Cameroun\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]",  hasCasier: false,  id_casier: '1', id_categorie: '2', id_famille: '2', _fournisseurs: [{id: 1, nom: "toto"}], _fournisseurs_ids:[1,2]};
    component.produit = mockProduit;
    component.avarisForm.setValue({
      qte: '10',
      description: 'Test Description',
      date: new Date().toJSON()
    });

    avarisSvcSpy.create.and.returnValue(Promise.resolve(true));
    // spyOn(showToast, 'success').and.callThrough();
    // spyOn(resetForm, 'call').and.callThrough();

    await component.submit();

    expect(avarisSvcSpy.create).toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith('Nouveau element créer');
    expect(resetForm).toHaveBeenCalledWith(component.avarisForm);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/avaris');
  });

  it('should handle form submission for updating an avaris', async () => {
    component.action = 'update';
    const mockAvaris: Avaris = { id: 1, qte: 5, description: 'Test Update', date: new Date().getTime(), all_ready_inventoried: false,produit_id: 1, produit_nom: 'Produit1', point_vente_id: 1, createdAt: 0, updatedAt: 0, deletedAt: 0 };
    component.avaris = mockAvaris;
    component.avarisForm.setValue({
      qte: '15',
      description: 'Updated Description',
      date: new Date().toJSON()
    });

    avarisSvcSpy.update.and.returnValue(Promise.resolve(true));
    // spyOn(showToast, 'call').and.callThrough();
    // spyOn(resetForm, 'call').and.callThrough();

    await component.submit();

    expect(avarisSvcSpy.update).toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith('element mis à jour');
    expect(resetForm).toHaveBeenCalledWith(component.avarisForm);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/avaris');
  });

  it('should open the modal and select a product', () => {
    const mockProduit: Produit = {qte: 0 , deletedAt : 0, id: 19, imgLink: "assets/product-img/preconfig-whisky-black.jpeg", nbreBtleParCasier: 6, nom: "Black & White", prixA:  48000, prixV: 60000 , ristourne: 0, upload:  "",user_id : 1,fournisseurs: "[{\"id\":2,\"nom\":\"Guinness Cameroun\"},{\"id\":1,\"nom\":\"Rene Tkc\"}]",  hasCasier: false,  id_casier: '1', id_categorie: '2', id_famille: '2', _fournisseurs: [{id: 1, nom: "toto"}], _fournisseurs_ids:[1,2]};
    
    component.produit = mockProduit;

    const modalSpy = jasmine.createSpyObj('modal', ['dismiss']);
    const produitEltSpy = jasmine.createSpyObj('produitElt', ['open']);
    component.produitElt = produitEltSpy;
    component.modal = modalSpy;

    component.openModal();
    expect(produitEltSpy.open).toHaveBeenCalled();

    component.selectProd(mockProduit);
    expect(component.produit).toEqual(mockProduit);
    expect(modalSpy.dismiss).toHaveBeenCalled();
  });

  // it('should handle quantity in stock calculation', async () => {
  //   const mockReste: Reste[] = [{ produits: JSON.stringify([{ id: 1, qte_btle: 10 }])];
  //   const mockUninventoryRavitaillements: Ravitaillement[] = [{ produits: JSON.stringify([{ id: 1, qte_btle: 5 }]) }];
  //   inventorySvcSpy.getLastStock.and.returnValue(Promise.resolve(mockReste));
  //   inventorySvcSpy.getUninventoryRavitaillements.and.returnValue(Promise.resolve(mockUninventoryRavitaillements));

  //   component.produit = { id: 1, nom: 'Produit1', imgLink: 'image1.jpeg' };
  //   const qtyInStock = await component.qtyProductInStock();
  //   expect(qtyInStock).toBe(15);
  // });

});

