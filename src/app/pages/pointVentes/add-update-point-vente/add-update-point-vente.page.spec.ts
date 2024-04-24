import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdatePointVentePage } from './add-update-point-vente.page';

describe('AddUpdatePointVentePage', () => {
  let component: AddUpdatePointVentePage;
  let fixture: ComponentFixture<AddUpdatePointVentePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUpdatePointVentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
