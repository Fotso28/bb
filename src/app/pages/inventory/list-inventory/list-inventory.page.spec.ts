import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ListInventoryPage } from './list-inventory.page';

describe('ListInventoryPage', () => {
  let component: ListInventoryPage;
  let fixture: ComponentFixture<ListInventoryPage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ListInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
