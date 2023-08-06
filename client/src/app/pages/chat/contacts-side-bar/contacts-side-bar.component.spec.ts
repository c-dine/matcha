import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsSideBarComponent } from './contacts-side-bar.component';

describe('ContactsSideBarComponent', () => {
  let component: ContactsSideBarComponent;
  let fixture: ComponentFixture<ContactsSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactsSideBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
