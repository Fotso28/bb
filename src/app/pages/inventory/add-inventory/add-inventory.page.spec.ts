import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AddInventoryPage } from './add-inventory.page';
import { AvarisService } from 'src/app/services/avaris.service';
import { CameraService } from 'src/app/services/camera.service';
import { InventoryService } from 'src/app/services/inventory.service';
import { LoggerService } from 'src/app/services/logger.service';
import { ProduitService } from 'src/app/services/produit.service';
import { IonicModule, NavController } from '@ionic/angular';

describe('AddInventoryPage', () => {
  let component: AddInventoryPage;
  let fixture: ComponentFixture<AddInventoryPage>;
  let avarisSvcMock: any;
  let cameraSvcMock: any;
  let inventorySvcMock: any;
  let loggerSvcMock: any;
  let productSvcMock: any;
  let routerMock: any;

  const mockProducts = [{
    id: 1,
    prixA: 1000,
    prixV: 1500,
    nbreBtleParCasier: 12,
    nom: 'Produit Example',
    qte_btle: 100,
    ristourne: 5,
    famille: 'Famille A',
    categorie: 'Catégorie 1',
    fournisseurs: ['Fournisseur 1', 'Fournisseur 2'],
    hasCasier: true,
    imgLink: 'assets/product-img/sample.jpg'
  }];

  beforeEach(waitForAsync(() => {
    avarisSvcMock = jasmine.createSpyObj('AvarisService', ['getAllUninventoryAraris']);
    cameraSvcMock = jasmine.createSpyObj('CameraService', ['readPhoto']);
    inventorySvcMock = jasmine.createSpyObj('InventoryService', ['getLastStock', 'getUninventoryRavitaillements', 'extractProductFromRavitaillement', 'getLastStock']);
    loggerSvcMock = jasmine.createSpyObj('LoggerService', ['log', 'warn']);
    productSvcMock = jasmine.createSpyObj('ProduitService', ['getProduitRavitaillesList']);
    routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      declarations: [ AddInventoryPage ],
      imports: [ ReactiveFormsModule, FormsModule, IonicModule ],
      providers: [
        { provide: AvarisService, useValue: avarisSvcMock },
        { provide: CameraService, useValue: cameraSvcMock },
        { provide: InventoryService, useValue: inventorySvcMock },
        { provide: LoggerService, useValue: loggerSvcMock },
        { provide: ProduitService, useValue: productSvcMock },
        { provide: NavController, useValue: { navigateForward: jasmine.createSpy('navigateForward') } },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInventoryPage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should initialize products and form', async () => {
    
  //   productSvcMock.getProduitRavitaillesList.and.returnValue(Promise.resolve(mockProducts));
  //   cameraSvcMock.readPhoto.and.returnValue(Promise.resolve({ data: 'base64data' }));
  //   await component.ngOnInit();

  //   expect(component.produits).toEqual(mockProducts);
  //   expect(component.productForm).toBeDefined();
  //   expect(cameraSvcMock.readPhoto).toHaveBeenCalledWith('test.jpg');
  // });

  it('should update last stock with avaris', async () => {
    inventorySvcMock.getLastStock.and.returnValue(Promise.resolve([]));
    avarisSvcMock.getAllUninventoryAraris.and.returnValue(Promise.resolve([]));
    await component.updateLastStoWithAvaris();

    expect(inventorySvcMock.getLastStock).toHaveBeenCalled();
    expect(avarisSvcMock.getAllUninventoryAraris).toHaveBeenCalled();
  });

  // it('should handle form submission correctly', async () => {
  //   // const mockProducts = [
  //   //   { id: 1, className: 'Produit', nom: 'Produit 1', user_id: 1, qte_btle: 0, imgLink: 'test.jpg' }
  //   // ];
  //   component.produits = mockProducts;
  //   component.buildForm();
  //   component.productForm.setValue({ quantities: ['10'] });
  //   inventorySvcMock.restes = [];
  //   inventorySvcMock.getUninventoryRavitaillements.and.returnValue(Promise.resolve([]));
  //   inventorySvcMock.sommeProduitVendu.and.returnValue(true);
  //   inventorySvcMock.sommePrix.and.returnValue(100);
  //   inventorySvcMock.isNotEmpty.and.returnValue(true);

  //   await component.onSubmit();

  //   expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/more-detail');
  // });

  // it('should handle form submission with errors', async () => {
  //   component.produits = [];
  //   component.buildForm();
  //   component.productForm.setValue({ quantities: ['abc'] });

  //   await component.onSubmit();

  //   expect(loggerSvcMock.log).toHaveBeenCalledWith('Certaines valeur sont erronées');
  // });
});
