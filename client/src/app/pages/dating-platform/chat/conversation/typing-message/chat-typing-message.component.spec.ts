import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatTypingMessageComponent } from './chat-typing-message.component';

describe('ChatTypingMessageComponent', () => {
  let component: ChatTypingMessageComponent;
  let fixture: ComponentFixture<ChatTypingMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatTypingMessageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatTypingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
