import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddProduitPage } from './add-produit.page';

describe('AddProduitPage', () => {
  let component: AddProduitPage;
  let fixture: ComponentFixture<AddProduitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddProduitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
