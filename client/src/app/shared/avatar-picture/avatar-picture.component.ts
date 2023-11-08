import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-avatar-picture',
	templateUrl: './avatar-picture.component.html',
	styleUrls: ['./avatar-picture.component.css']
})
export class AvatarPictureComponent {

	@Input()
	src!: string;
}

