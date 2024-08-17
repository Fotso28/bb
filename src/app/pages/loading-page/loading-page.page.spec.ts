import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoadingPagePage } from './loading-page.page';

describe('LoadingPagePage', () => {
  let component: LoadingPagePage;
  let fixture: ComponentFixture<LoadingPagePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(LoadingPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
