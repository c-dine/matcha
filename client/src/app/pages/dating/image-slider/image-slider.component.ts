import { Component } from '@angular/core';

@Component({
  selector: 'app-image-slider',
  templateUrl: './image-slider.component.html',
  styleUrls: ['./image-slider.component.css']
})
export class ImageSliderComponent {
  slides = [
    { image: 'https://images.unsplash.com/photo-1682687218608-5e2522b04673?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80', altText: 'Image 1' },
    { image: 'https://plus.unsplash.com/premium_photo-1681406994502-bb673c265877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80', altText: 'Image 2' },
    { image: 'https://images.unsplash.com/photo-1682687221006-b7fd60cf9dd0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80', altText: 'Image 3' }
  ];

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

