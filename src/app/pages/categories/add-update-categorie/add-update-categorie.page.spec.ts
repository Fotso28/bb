import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateCategoriePage } from './add-update-categorie.page';

describe('AddUpdateCategoriePage', () => {
  let component: AddUpdateCategoriePage;
  let fixture: ComponentFixture<AddUpdateCategoriePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUpdateCategoriePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
