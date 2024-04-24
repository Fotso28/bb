import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PointVentePage } from './point-vente.page';

describe('PointVentePage', () => {
  let component: PointVentePage;
  let fixture: ComponentFixture<PointVentePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PointVentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
