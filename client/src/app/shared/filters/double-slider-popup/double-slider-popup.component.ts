import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: 'app-double-slider-popup',
	templateUrl: './double-slider-popup.component.html',
	styleUrls: ['./double-slider-popup.component.css', '../../../styles/filters.css', '../../../styles/buttons.css']
})
export class DoubleSliderPopupComponent {

	@Input() label!: string;
	@Input() description!: string;
	@Input() min!: number;
	@Input() max!: number;
	@Output() appliedValue = new EventEmitter<{ min: number, max: number } | undefined>()

	minValue!: number;
	maxValue!: number;

	ngOnInit() {
		this.minValue = this.min;
		this.maxValue = this.max;
	}

	onResetClick() {
		this.minValue = this.min;
		this.maxValue = this.max;
		this.appliedValue.emit(undefined);
	}

	onApplyClick() {
		if (this.minValue > this.maxValue || this.minValue < this.min || this.maxValue > this.max) {
			this.onResetClick();
			return;
		}
		this.appliedValue.emit({
			min: this.minValue,
			max: this.maxValue
		});
	}
} 