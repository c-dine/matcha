import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarPictureComponent } from './avatar-picture.component';

describe('ImageSliderComponent', () => {
  let component: AvatarPictureComponent;
  let fixture: ComponentFixture<AvatarPictureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarPictureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarPictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
