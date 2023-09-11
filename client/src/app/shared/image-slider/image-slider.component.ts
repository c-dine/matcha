import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-image-slider',
	templateUrl: './image-slider.component.html',
	styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent {

	@Input() picturesUrl!: string[];

	slideOffset = 0;
	activeSlideIndex = 0;

	goToSlide(index: number) {
		const slideWidth = document.querySelector('.image-slider-item')?.clientWidth;
		if (slideWidth) {
			this.slideOffset = -index * slideWidth;
			this.activeSlideIndex = index;
		}
	}
}

