import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMatchBarComponent } from './chat-match-bar.component';

describe('ChatMatchBarComponent', () => {
  let component: ChatMatchBarComponent;
  let fixture: ComponentFixture<ChatMatchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatMatchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatMatchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
