import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatingCardPassionsComponent } from './dating-card-passions.component';

describe('DatingCardPassionsComponent', () => {
  let component: DatingCardPassionsComponent;
  let fixture: ComponentFixture<DatingCardPassionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatingCardPassionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatingCardPassionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
