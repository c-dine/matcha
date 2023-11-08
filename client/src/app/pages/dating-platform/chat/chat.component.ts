import { Component } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
	constructor() {
	}
}
