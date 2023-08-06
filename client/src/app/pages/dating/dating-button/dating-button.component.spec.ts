import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatingButtonComponent } from './dating-button.component';

describe('DatingButtonComponent', () => {
  let component: DatingButtonComponent;
  let fixture: ComponentFixture<DatingButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatingButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatingButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
