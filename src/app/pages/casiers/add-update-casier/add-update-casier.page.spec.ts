import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateCasierPage } from './add-update-casier.page';

describe('AddUpdateCasierPage', () => {
  let component: AddUpdateCasierPage;
  let fixture: ComponentFixture<AddUpdateCasierPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUpdateCasierPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
