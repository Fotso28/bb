import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FournisseurPage } from './fournisseur.page';

describe('FournisseurPage', () => {
  let component: FournisseurPage;
  let fixture: ComponentFixture<FournisseurPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FournisseurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
