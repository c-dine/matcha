import { Component } from '@angular/core';
import { ActivitySocketService } from 'src/app/service/socket/activitySocket.service';
import { ChatSocketService } from 'src/app/service/socket/chatSocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

	constructor(
		private chatSocket: ChatSocketService,
		private activitySocket: ActivitySocketService,
	) {}

	ngOnInit() {
	}

	sendMessage() {
		this.chatSocket.sendMessage('test');
		this.activitySocket.sendMessage('test');
	}
}
