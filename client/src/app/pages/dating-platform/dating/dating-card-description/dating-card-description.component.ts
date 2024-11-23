import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'app-dating-card-description',
	templateUrl: './dating-card-description.component.html',
	styleUrls: [
		'./dating-card-description.component.css',
		'../dating.component.css'
	]
})
export class DatingCardDescriptionComponent {
	@Input()
	firstName!: string;

	@Input()
	id!: string | undefined;

	@Input()
	lastName!: string;

	@Input()
	distance!: number | undefined;

	@Input()
	biography!: string;

	@Output()
	clicked: EventEmitter<any> = new EventEmitter();

	constructor(private router: Router) { }

	receiveClickEvent(name: string): void {
		this.clicked.emit(name);
	}

	goToProfile() {
		if (this.id)
			this.router.navigate([`/app/profile`], { queryParams: { id: this.id } });
	}
}
