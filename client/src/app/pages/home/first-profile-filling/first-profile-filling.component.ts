import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ageValidator, dateIsPastDateValidator, minArrayLengthValidator } from 'src/app/validators/custom-validators';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisplayableProfilePictures } from '@shared-models/picture.model';
import { PictureService } from 'src/app/service/picture.service';
import { GeoCoordinate, User } from '@shared-models/user.model';
import { UserService } from 'src/app/service/user.service';

enum FirstFillingProfileMode {
	INTRO = 0,
	SEXUAL_PROFILE = 1,
	PERSONNAL_PROFILE = 2,
	END = 3
}
@Component({
	selector: 'app-first-profile-filling',
	templateUrl: './first-profile-filling.component.html',
	styleUrls: ['./first-profile-filling.component.css', '../../../styles/dialog.css', '../../../styles/form.css', '../../../styles/buttons.css']
})
export class FirstProfileFillingComponent {

	FILLING_PROFILE_STEP_COUNT = 3;
	isLoading = true;
	FirstFillingProfileMode = FirstFillingProfileMode;
	firstFillingProfileMode: number = FirstFillingProfileMode.INTRO;

	pictures: DisplayableProfilePictures = {
		profilePicture: undefined,
		additionnalPictures: []
	}

	profileForm = new FormGroup({
		sexualProfile: new FormGroup({
			gender: new FormControl<string>('', [Validators.required]),
			sexualPreferences: new FormControl<string>('', [Validators.required]),
			birthDate: new FormControl<Date | undefined>(undefined, [Validators.required, dateIsPastDateValidator(), ageValidator(18)])
		}),
		personnalProfile: new FormGroup({
			biography: new FormControl<string>('', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]),
			tags: new FormControl<string[]>([]),
		}),
	});

	location: GeoCoordinate | undefined;

	constructor(
		private authService: AuthService,
		private pictureService: PictureService,
		private router: Router,
		private snackBar: MatSnackBar,
		private userService: UserService
	) { }

	async ngOnInit() {
		await this.redirectUserIfNotAllowed();
		
		if ("geolocation" in navigator)
			this.location = await new Promise((resolve, reject) => {
		 		navigator.geolocation.getCurrentPosition(
					position => resolve({ latitude: position.coords.latitude, longitude: position.coords.longitude}),
					error => resolve(undefined)
				);
			});
		this.isLoading = false;
	}

	async redirectUserIfNotAllowed() {
		if (!(await this.authService.isLoggedIn()))
			this.router.navigate([""]);
		if (await this.userService.userHasProfile())
			this.router.navigate(["/app"]);
	}

	async onSubmit() {
		this.isLoading = true;

		const picturesIds = await this.pictureService.uploadAndGetPicturesIds(this.pictures);
		if (!picturesIds) {
			this.firstFillingProfileMode = FirstFillingProfileMode.INTRO;
			this.snackBar.open("Error uploading picture. Try again.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			this.isLoading = false;
			return;
		}
		const formValue = this.profileForm.getRawValue();
		const newProfile = {
			...formValue.personnalProfile,
			...formValue.sexualProfile,
			picturesIds,
			location: this.location
		} as User;

		this.userService.createProfile(newProfile)
			.subscribe({
				next: () => {
					this.router.navigate(["/app"]);
					this.isLoading = false;
				},
				error: () => this.isLoading = false
			})
	}

	setTags(tags: string[]) {
		this.profileForm.get("personnalProfile.tags")?.setValue(tags);
	}

	canGoNext() {
		switch (this.firstFillingProfileMode) {
			case FirstFillingProfileMode.INTRO:
				if (!this.pictures.profilePicture)
					return false;
				break;
			case FirstFillingProfileMode.SEXUAL_PROFILE:
				if (this.profileForm.get("sexualProfile")?.invalid)
					return false;
				break;
			case FirstFillingProfileMode.PERSONNAL_PROFILE:
				if (this.profileForm.get("personnalProfile")?.invalid)
					return false;
				break;
		}
		return true;
	}

	onSwitchNextModeClick() {
		this.firstFillingProfileMode =
			this.firstFillingProfileMode === FirstFillingProfileMode.END ?
				FirstFillingProfileMode.END : this.firstFillingProfileMode + 1;
	}

	onSwitchPreviousModeClick() {
		this.firstFillingProfileMode =
			this.firstFillingProfileMode === FirstFillingProfileMode.INTRO ?
				FirstFillingProfileMode.INTRO : this.firstFillingProfileMode - 1;
	}

	updatePictures(pictures: DisplayableProfilePictures) {
		this.pictures = pictures;
	}
}
