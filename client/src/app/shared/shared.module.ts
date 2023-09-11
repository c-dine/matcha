import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavSideBarComponent } from './nav-side-bar/nav-side-bar.component';
import { NotificationsSideBarComponent } from './notifications-side-bar/notifications-side-bar.component';
import { UserInformationsComponent } from './nav-side-bar/user-informations/user-informations.component';
import { NavigationListComponent } from './nav-side-bar/navigation-list/navigation-list.component';
import { NavigationElementComponent } from './nav-side-bar/navigation-list/navigation-element/navigation-element.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { BoxComponent } from './notifications-side-bar/box/box.component';
import { NotificationCardComponent } from './notifications-side-bar/notification-card/notification-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TagInputComponent } from './tag-input/tag-input.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProfilePicturesComponent } from './profile-pictures/profile-pictures.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DoubleSliderPopupComponent } from './filters/double-slider-popup/double-slider-popup.component';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SliderPopupComponent } from './filters/slider-popup/slider-popup.component';
import { TagsPopupComponent } from './filters/tags-popup/tags-popup.component';
import { ImageSliderComponent } from './image-slider/image-slider.component';

@NgModule({
  declarations: [
    HeaderComponent,
    NavSideBarComponent,
    NotificationsSideBarComponent,
    UserInformationsComponent,
    NavigationListComponent,
    NavigationElementComponent,
    BoxComponent,
    NotificationCardComponent,
	TagInputComponent,
	SpinnerComponent,
	ProfilePicturesComponent,
	DoubleSliderPopupComponent,
	SliderPopupComponent,
	TagsPopupComponent,
	ImageSliderComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatDividerModule,
	MatFormFieldModule,
	MatChipsModule,
	MatAutocompleteModule,
	MatProgressSpinnerModule,
	BrowserAnimationsModule,
	MatSliderModule,
	FormsModule,
	ReactiveFormsModule,
	MatInputModule
  ],
  exports: [
    HeaderComponent,
    NavSideBarComponent,
    NotificationsSideBarComponent,
	TagInputComponent,
	SpinnerComponent,
	ProfilePicturesComponent,
	SliderPopupComponent,
	DoubleSliderPopupComponent,
	TagsPopupComponent,
	ImageSliderComponent
  ]
})
export class SharedModule { }
