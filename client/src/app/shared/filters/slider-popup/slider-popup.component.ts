import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: 'app-slider-popup',
	templateUrl: './slider-popup.component.html',
	styleUrls: ['./slider-popup.component.css', '../../../styles/filters.css', '../../../styles/buttons.css']
})
export class SliderPopupComponent {

	@Input() label!: string;
	@Input() description!: string;
	@Input() max!: number;
	@Input() maxValue!: number;
	@Output() appliedValue = new EventEmitter<number | undefined>()

	onResetClick() {
		this.maxValue = this.max;
		this.appliedValue.emit(undefined);
	}

	onApplyClick() {
		this.appliedValue.emit(
			this.maxValue
		);
	}
} 