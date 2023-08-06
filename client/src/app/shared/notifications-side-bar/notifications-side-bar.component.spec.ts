import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSideBarComponent } from './notifications-side-bar.component';

describe('NotificationsSideBarComponent', () => {
  let component: NotificationsSideBarComponent;
  let fixture: ComponentFixture<NotificationsSideBarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NotificationsSideBarComponent]
    });
    fixture = TestBed.createComponent(NotificationsSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
