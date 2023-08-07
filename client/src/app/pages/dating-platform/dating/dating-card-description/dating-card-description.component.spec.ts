import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatingCardDescriptionComponent } from './dating-card-description.component';

describe('DatingCardDescriptionComponent', () => {
  let component: DatingCardDescriptionComponent;
  let fixture: ComponentFixture<DatingCardDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatingCardDescriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatingCardDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
