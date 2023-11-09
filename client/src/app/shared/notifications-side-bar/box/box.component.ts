import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationWithAuthor } from '@shared-models/notification.model';

@Component({
	selector: 'app-box',
	templateUrl: './box.component.html',
	styleUrls: ['./box.component.css']
})
export class BoxComponent {
	@Input()
	title!: string;

	@Input()
	notifications!: NotificationWithAuthor[];

	constructor() { }
}
