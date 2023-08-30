import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: 'app-slider-popup',
	templateUrl: './slider-popup.component.html',
	styleUrls: ['./slider-popup.component.css', '../../../styles/filters.css', '../../../styles/buttons.css']
})
export class SliderPopupComponent {

	@Input() label!: string;
	@Input() description!: string;
	@Input() min!: number;
	@Input() max!: number;
	@Output() appliedValue = new EventEmitter<{ min: number, max: number }>()

	minValue!: number;
	maxValue!: number;

	ngOnInit() {
		this.minValue = this.min;
		this.maxValue = this.max;
	}

	onResetClick() {
		this.minValue = this.min;
		this.maxValue = this.max;
	}

	onApplyClick() {
		if (this.minValue > this.maxValue) {
			this.onResetClick();
			return;
		}
		this.appliedValue.emit({
			min: this.minValue,
			max: this.maxValue
		});
	}
} 