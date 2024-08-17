import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BdService } from './services/-bd.service';
import { UserService } from './services/user.service';
import { PointVenteService } from './services/point-vente.service';
import { StatusBar } from '@capacitor/status-bar';
import { of } from 'rxjs';
import { PointVente } from './models/PointVentes';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let platformSpy: jasmine.SpyObj<Platform>;
  let bdServiceSpy: jasmine.SpyObj<BdService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let pointVenteServiceSpy: jasmine.SpyObj<PointVenteService>;

  // Avant chaque test, nous configurons le module de test et initialisons les objets espions
  beforeEach(() => {
    // Création des objets espions pour chaque service utilisé dans le composant
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    platformSpy = jasmine.createSpyObj('Platform', ['ready', 'is']);
    bdServiceSpy = jasmine.createSpyObj('BdService', ['initDatabase']);
    userServiceSpy = jasmine.createSpyObj('UserService', ['getActiveUser', 'setActiveUser']);
    pointVenteServiceSpy = jasmine.createSpyObj('PointVenteService', ['getActivePointeVente', 'all', 'setActivePointVente']);

    // Configuration du module de test
    TestBed.configureTestingModule({
      declarations: [AppComponent],  // Déclaration du composant que nous testons
      providers: [
        { provide: Router, useValue: routerSpy },  // Fournir l'objet espion pour Router
        { provide: Platform, useValue: platformSpy },  // Fournir l'objet espion pour Platform
        { provide: BdService, useValue: bdServiceSpy },  // Fournir l'objet espion pour BdService
        { provide: UserService, useValue: userServiceSpy },  // Fournir l'objet espion pour UserService
        { provide: PointVenteService, useValue: pointVenteServiceSpy }  // Fournir l'objet espion pour PointVenteService
      ]
    });

    // Création de l'instance du composant et du fixture
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Configuration des méthodes espions pour les tests
    platformSpy.ready.and.returnValue(Promise.resolve("la platforme est prete"));  // La méthode ready retourne une promesse résolue
    platformSpy.is.and.callFake((platform: string) => platform === 'capacitor');  // Simule le retour pour vérifier si la plateforme est 'capacitor'

    userServiceSpy.getActiveUser.and.returnValue(null);  // Simule le retour pour obtenir un utilisateur actif (null dans ce cas)
    userServiceSpy.setActiveUser.and.returnValue(undefined);  // Simule la méthode pour définir un utilisateur actif

    pointVenteServiceSpy.getActivePointeVente.and.returnValue(null);  // Simule le retour pour obtenir un point de vente actif (null dans ce cas)
    pointVenteServiceSpy.all.and.returnValue(Promise.resolve([new PointVente('Test PV')]));  // Simule le retour pour obtenir tous les points de vente
    pointVenteServiceSpy.setActivePointVente.and.returnValue(undefined);  // Simule la méthode pour définir un point de vente actif
  });

  // Test pour vérifier que le composant est créé correctement
  it('should create the component', () => {
    expect(component).toBeTruthy();  // Vérifie que le composant est correctement instancié
  });

  // Test pour vérifier le comportement lors de l'initialisation
  it('should initialize the component', async () => {
    // Appel de la méthode ngOnInit
    await component.ngOnInit();

    // Vérifie que l'utilisateur actif est défini si aucun utilisateur n'est trouvé
    expect(userServiceSpy.setActiveUser).toHaveBeenCalledWith({ id: 1, name: 'Test User', age: 30 });

    // Vérifie que la base de données est initialisée si la plateforme est 'capacitor'
    expect(bdServiceSpy.initDatabase).toHaveBeenCalled();

    // Vérifie que le point de vente actif est défini si aucun point de vente actif n'est trouvé
    expect(pointVenteServiceSpy.all).toHaveBeenCalled();
    expect(pointVenteServiceSpy.setActivePointVente).toHaveBeenCalledWith(new PointVente('Test PV'));
  });

  // Test pour vérifier le comportement de la méthode activePointVente
  it('should activate a point de vente', async () => {
    // Appel de la méthode activePointVente
    await component.activePointVente();

    // Vérifie que la méthode getActivePointeVente a été appelée
    expect(pointVenteServiceSpy.getActivePointeVente).toHaveBeenCalled();

    // Vérifie que la méthode all a été appelée pour obtenir tous les points de vente
    expect(pointVenteServiceSpy.all).toHaveBeenCalled();

    // Vérifie que le premier point de vente a été défini comme actif
    expect(pointVenteServiceSpy.setActivePointVente).toHaveBeenCalledWith(new PointVente('Test PV'));
  });

  // Test pour vérifier le comportement du constructeur
  it('should configure the status bar in capacitor platform', async () => {
    // Spy pour vérifier l'appel à la configuration de StatusBar
    const statusBarSpy = spyOn(StatusBar, 'setOverlaysWebView').and.callFake(() => Promise.resolve());
    const statusBarColorSpy = spyOn(StatusBar, 'setBackgroundColor').and.callFake(() => Promise.resolve());

    // Création du composant
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;

    // Appel de la méthode ngOnInit pour initialiser le composant
    await component.ngOnInit();

    // Vérifie que les méthodes de StatusBar ont été appelées
    expect(statusBarSpy).toHaveBeenCalledWith({ overlay: false });
    expect(statusBarColorSpy).toHaveBeenCalledWith({ color: "#50c8ff" });
  });

});
