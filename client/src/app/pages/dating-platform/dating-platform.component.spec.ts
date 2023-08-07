import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatingPlatformComponent } from './dating-platform.component';

describe('DatingPlatformComponent', () => {
  let component: DatingPlatformComponent;
  let fixture: ComponentFixture<DatingPlatformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatingPlatformComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatingPlatformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
