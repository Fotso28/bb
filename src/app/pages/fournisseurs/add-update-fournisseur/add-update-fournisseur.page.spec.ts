import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateFournisseurPage } from './add-update-fournisseur.page';

describe('AddUpdateFournisseurPage', () => {
  let component: AddUpdateFournisseurPage;
  let fixture: ComponentFixture<AddUpdateFournisseurPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUpdateFournisseurPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
