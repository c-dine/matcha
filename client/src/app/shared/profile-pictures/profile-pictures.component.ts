import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environment/environment';
import { DisplayablePicture, DisplayableProfilePictures } from 'src/app/service/picture.service';

@Component({
	selector: 'app-profile-pictures',
	templateUrl: './profile-pictures.component.html',
	styleUrls: ['./profile-pictures.component.css', '../../styles/buttons.css', '../../styles/picture.css']
})
export class ProfilePicturesComponent {

	environment = environment;
	isLoading = false;

	@Input() pictures!: DisplayableProfilePictures;
	@Output() updatedPictures = new EventEmitter<DisplayableProfilePictures>();

	constructor(
		private snackBar: MatSnackBar,
	) { }

	deleteAdditionnalPicture(index: number) {
		this.pictures.additionnalPictures[index] = {};
		this.updatedPictures.emit(this.pictures);
	}

	deleteProfilePicture() {
		this.pictures.profilePicture = undefined;
		this.updatedPictures.emit(this.pictures);
	}

	async uploadProfilePic(event: any) {
		try {
			this.pictures.profilePicture = this.getFileMeta(event);
			this.updatedPictures.emit(this.pictures);
		} catch (error: any) {
			this.displayError();
		}
	}

	async uploadAdditionnalPic(event: any, index: number) {
		try {
			this.pictures.additionnalPictures[index] = this.getFileMeta(event);
			this.updatedPictures.emit(this.pictures);
		} catch (error: any) {
			this.displayError();
		}
	}

	displayError() {
		this.snackBar.open("Please select a valid picture (.jpg, .png ...).", "Close", {
			duration: 4000,
			panelClass: "error-snackbar"
		});
	}

	getFileMeta(event: any): DisplayablePicture {
		const file = event.target?.files[0];
		if (!file || !file.type.startsWith('image/')) throw new Error();
		const url = URL.createObjectURL(file);

		return { file, url };
	}
}
