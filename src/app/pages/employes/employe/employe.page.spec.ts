import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmployePage } from './employe.page';

describe('EmployePage', () => {
  let component: EmployePage;
  let fixture: ComponentFixture<EmployePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(EmployePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
