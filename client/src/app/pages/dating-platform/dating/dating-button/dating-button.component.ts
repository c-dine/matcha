import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { Component } from '@angular/core';

@Component({
	selector: 'app-dating-button',
	templateUrl: './dating-button.component.html',
	styleUrls: ['./dating-button.component.css']
})
export class DatingButtonComponent {
	@Input()
	iconName!: string;

	@Input()
	isHighlighted!: boolean;

	@Output()
	clicked: EventEmitter<any> = new EventEmitter();

	onClick(): void {
		this.clicked.emit();
	}
}
