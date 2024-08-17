import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AcceuilPage } from './accueil.page';
import { MenuController } from '@ionic/angular';
import { PointVenteService } from 'src/app/services/point-vente.service';

describe('AcceuilPage', () => {
  let component: AcceuilPage;
  let fixture: ComponentFixture<AcceuilPage>;
  let menuCtrlSpy: jasmine.SpyObj<MenuController>;
  let pvSvcSpy: jasmine.SpyObj<PointVenteService>;

  beforeEach(async () => {
    // Créez des spies pour les services injectés
    const menuCtrlSpyObj = jasmine.createSpyObj('MenuController', ['open']);
    const pvSvcSpyObj = jasmine.createSpyObj('PointVenteService', ['getActivePointeVente', 'setActivePointVente']);

    await TestBed.configureTestingModule({
      declarations: [ AcceuilPage ],
      imports: [ IonicModule.forRoot() ], // Importez IonicModule pour utiliser les fonctionnalités Ionic
      providers: [
        { provide: MenuController, useValue: menuCtrlSpyObj },
        { provide: PointVenteService, useValue: pvSvcSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AcceuilPage);
    component = fixture.componentInstance;
    menuCtrlSpy = TestBed.inject(MenuController) as jasmine.SpyObj<MenuController>;
    pvSvcSpy = TestBed.inject(PointVenteService) as jasmine.SpyObj<PointVenteService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call menuCtrl.open when openMenu is called', () => {
    component.openMenu();
    expect(menuCtrlSpy.open).toHaveBeenCalledWith('main-menu');
  });

  it('should call pointVenteComponent.openModal when openPointVente is called', () => {
    // Configurez le spy sur la méthode openModal
    const openModalSpy = spyOn(component.pointVenteComponent, 'openModal');

    component.openPointVente();

    expect(openModalSpy).toHaveBeenCalled();
  });

  // Vous pouvez ajouter d'autres tests en fonction des fonctionnalités du composant
});

