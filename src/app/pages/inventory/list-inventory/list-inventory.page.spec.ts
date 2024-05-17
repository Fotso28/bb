import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListInventoryPage } from './list-inventory.page';

describe('ListInventoryPage', () => {
  let component: ListInventoryPage;
  let fixture: ComponentFixture<ListInventoryPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListInventoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
