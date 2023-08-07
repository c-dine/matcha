import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent {
  @Input()
  message!: string;

  @Input()
  userProfilePictureSrc!: string;

  @Input()
  currentUser!: boolean; 
}
