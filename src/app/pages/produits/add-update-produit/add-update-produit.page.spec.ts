import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AddUpdateProduitPage } from './add-update-produit.page';

describe('AddUpdateProduitPage', () => {
  let component: AddUpdateProduitPage;
  let fixture: ComponentFixture<AddUpdateProduitPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(AddUpdateProduitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
