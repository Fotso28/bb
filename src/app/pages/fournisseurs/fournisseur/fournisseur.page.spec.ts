import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FournisseurPage } from './fournisseur.page';

describe('FournisseurPage', () => {
  let component: FournisseurPage;
  let fixture: ComponentFixture<FournisseurPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FournisseurPage ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FournisseurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
