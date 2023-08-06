import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInformationsComponent } from './user-informations.component';

describe('UserInformationsComponent', () => {
  let component: UserInformationsComponent;
  let fixture: ComponentFixture<UserInformationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInformationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserInformationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
