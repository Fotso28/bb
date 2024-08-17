import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AvarisPage } from './avaris.page';
import { AvarisService } from 'src/app/services/avaris.service';
import { BehaviorSubject, of } from 'rxjs';
import { showToast } from 'src/app/_lib/lib';
import { Avaris } from 'src/app/models/Avaris';

describe('AvarisPage', () => {
  let component: AvarisPage;
  let fixture: ComponentFixture<AvarisPage>;
  let avarisSvcSpy: jasmine.SpyObj<AvarisService>;
  let actionSheetCtrlSpy: jasmine.SpyObj<ActionSheetController>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const avarisSvcSpyObj = jasmine.createSpyObj('AvarisService', ['getAll', 'delete', 'hydrateAvaris', 'avarisSubject']);
    const actionSheetCtrlSpyObj = jasmine.createSpyObj('ActionSheetController', ['create']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // Simulez un BehaviorSubject pour avarisSubject
    const mockBehaviorSubject = new BehaviorSubject<Avaris[]>([]); // Remplacez `[]` par une valeur si nécessaire
    avarisSvcSpyObj.avarisSubject = mockBehaviorSubject;

    await TestBed.configureTestingModule({
      declarations: [ AvarisPage ],
      imports: [ IonicModule.forRoot() ],
      providers: [
        { provide: AvarisService, useValue: avarisSvcSpyObj },
        { provide: ActionSheetController, useValue: actionSheetCtrlSpyObj },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AvarisPage);
    component = fixture.componentInstance;
    avarisSvcSpy = TestBed.inject(AvarisService) as jasmine.SpyObj<AvarisService>;
    actionSheetCtrlSpy = TestBed.inject(ActionSheetController) as jasmine.SpyObj<ActionSheetController>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize avaris data on ngOnInit', async () => {
    const mockAvaris: boolean = true; // Remplacez par des objets Avaris si nécessaire
    const mockAvarisList: Avaris[] = [new Avaris(), new Avaris()]
    avarisSvcSpy.getAll.and.returnValue(Promise.resolve(mockAvaris));
    avarisSvcSpy.avarisSubject.next([new Avaris()]); // Utilisez next() pour émettre la valeur

    await component.ngOnInit();

    expect(component.avaris).toEqual(mockAvarisList.reverse()); // Assurez-vous que le reverse est bien nécessaire
    expect(avarisSvcSpy.getAll).toHaveBeenCalled();
    expect(avarisSvcSpy.avarisSubject.subscribe).toHaveBeenCalled();
  });

  it('should show toast and call delete method when deleting an avaris', async () => {
    const mockAvaris: Avaris = { all_ready_inventoried: false,
       id: 1, createdAt: 0, deletedAt:0, updatedAt: 0 };
    const slidingItemSpy = jasmine.createSpyObj('slidingItem', ['close']);
    const actionSheetSpy = jasmine.createSpyObj('actionSheet', ['present', 'onWillDismiss']);
    actionSheetCtrlSpy.create.and.returnValue(Promise.resolve(actionSheetSpy));
    actionSheetSpy.onWillDismiss.and.returnValue(Promise.resolve({ role: 'confirm' }));

    spyOn(window, 'toString'); // Spy sur showToast

    avarisSvcSpy.hydrateAvaris.and.returnValue(mockAvaris);
    avarisSvcSpy.delete.and.returnValue(Promise.resolve(true));

    await component.delete(mockAvaris, slidingItemSpy);

    expect(slidingItemSpy.close).toHaveBeenCalled();
    expect(actionSheetCtrlSpy.create).toHaveBeenCalled();
    expect(avarisSvcSpy.delete).toHaveBeenCalledWith(mockAvaris);
    expect(showToast).toHaveBeenCalledWith('Bien supprimé!');
  });

  it('should navigate to update avaris detail page when gotoFamilleDetail is called', () => {
    const mockAvaris: Avaris = { all_ready_inventoried: false,
      id: 1, createdAt: 0, deletedAt:0, updatedAt: 0 };;
    component.gotoFamilleDetail(mockAvaris);
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/add-update-avaris/update', { state: mockAvaris });
  });

  it('should show toast when trying to delete an avaris that is already inventoried', async () => {
    const mockAvaris: Avaris = { all_ready_inventoried: true,
      id: 1, createdAt: 0, deletedAt:0, updatedAt: 0 };; // Exemple avec une propriété de vérification
    const slidingItemSpy = jasmine.createSpyObj('slidingItem', ['close']);
    spyOn(window, 'toString'); // Spy sur showToast

    await component.delete(mockAvaris, slidingItemSpy);

    expect(slidingItemSpy.close).toHaveBeenCalled();
    expect(showToast).toHaveBeenCalledWith('Impossible de supprimer cet Avaris');
  });
});
