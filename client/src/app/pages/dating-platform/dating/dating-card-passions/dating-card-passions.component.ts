import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-dating-card-passions',
	templateUrl: './dating-card-passions.component.html',
	styleUrls: ['./dating-card-passions.component.css']
})
export class DatingCardPassionsComponent {
	@Input()
	tags!: string[] | undefined;
}
