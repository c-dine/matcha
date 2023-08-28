import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@environment/environment';
import { DisplayablePicture, DisplayableProfilePictures } from '@shared-models/picture.model';

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
		this.pictures.additionnalPictures.splice(index, 1);
		this.updatedPictures.emit(this.pictures);
	}

	deleteProfilePicture() {
		this.pictures.profilePicture = undefined;
		this.updatedPictures.emit(this.pictures);
	}

	uploadPicture(event: any) {
		if (this.pictures.additionnalPictures.length === 4) return;
		try {
			const fileMeta = this.getFileMeta(event);
			if (!this.pictures.profilePicture)
				this.pictures.profilePicture = fileMeta;
			else {
				this.pictures.additionnalPictures.push(fileMeta);
			}
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
