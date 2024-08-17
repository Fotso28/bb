import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddUpdatePointVentePage } from './add-update-point-vente.page';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule, ToastController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { PointVenteService } from 'src/app/services/point-vente.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('AddUpdatePointVentePage', () => {
  let component: AddUpdatePointVentePage;
  let fixture: ComponentFixture<AddUpdatePointVentePage>;
  let toastController: ToastController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddUpdatePointVentePage ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        IonicModule.forRoot(),
        RouterTestingModule
      ],
      providers: [
        PointVenteService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => 'add' // or 'update' depending on your test case
              }
            }
          }
        },
        ToastController
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddUpdatePointVentePage);
    component = fixture.componentInstance;
    toastController = TestBed.inject(ToastController);
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

