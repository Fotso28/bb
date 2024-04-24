import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FamillePage } from './famille.page';

describe('FamillePage', () => {
  let component: FamillePage;
  let fixture: ComponentFixture<FamillePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FamillePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
