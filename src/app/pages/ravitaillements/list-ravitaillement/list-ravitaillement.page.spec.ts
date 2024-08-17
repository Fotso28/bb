import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListRavitaillementPage } from './list-ravitaillement.page';

describe('ListRavitaillementPage', () => {
  let component: ListRavitaillementPage;
  let fixture: ComponentFixture<ListRavitaillementPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ListRavitaillementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
