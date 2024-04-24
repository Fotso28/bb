import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CasierPage } from './casier.page';

describe('CasierPage', () => {
  let component: CasierPage;
  let fixture: ComponentFixture<CasierPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CasierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
