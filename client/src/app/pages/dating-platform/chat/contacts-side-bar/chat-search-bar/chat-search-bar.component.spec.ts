import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSearchBarComponent } from './chat-search-bar.component';

describe('ChatSearchBarComponent', () => {
  let component: ChatSearchBarComponent;
  let fixture: ComponentFixture<ChatSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
