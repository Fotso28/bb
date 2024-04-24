import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitPage } from './produit.page';

describe('ProduitPage', () => {
  let component: ProduitPage;
  let fixture: ComponentFixture<ProduitPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProduitPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
