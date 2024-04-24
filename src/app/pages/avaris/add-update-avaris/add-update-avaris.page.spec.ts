import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddUpdateAvarisPage } from './add-update-avaris.page';

describe('AddUpdateAvarisPage', () => {
  let component: AddUpdateAvarisPage;
  let fixture: ComponentFixture<AddUpdateAvarisPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AddUpdateAvarisPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
