import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { COMMA, ENTER, SPACE } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, firstValueFrom, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { minArrayLengthValidator } from 'src/app/validators/custom-validators';
import { TagService } from 'src/app/service/tag.service';
import { AuthService } from 'src/app/service/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/app/service/profile.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DisplayableProfilePictures, PresignedPictureUrl, ProfilePicturesIds } from '@shared-models/picture.model';
import { PictureService } from 'src/app/service/picture.service';
import { NewProfile } from '@shared-models/profile.model';

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

	separatorKeyCodes: number[] = [ENTER, COMMA, SPACE];
	availableTags!: string[];
	filteredTags: Observable<string[]> | undefined;
	
	pictures: DisplayableProfilePictures = {
		profilePicture: undefined,
		additionnalPictures: []
	}

	profileForm = new FormGroup({
		sexualProfile: new FormGroup({
			gender: new FormControl<string>('', [Validators.required]),
			sexualPreferences: new FormControl<string>('', [Validators.required]),
			birthDate: new FormControl<Date | undefined>(undefined, [Validators.required])
		}),
		personnalProfile: new FormGroup({
			biography: new FormControl<string>('', [Validators.required, Validators.minLength(50)]),
			tagInput: new FormControl<string | null>('', []),
			tags: new FormControl<string[]>([], [Validators.required, minArrayLengthValidator(3)]),
		}),
	});

	constructor(
		private authService: AuthService,
		private tagService: TagService,
		private pictureService: PictureService,
		private router: Router,
		private snackBar: MatSnackBar,
		private profileService: ProfileService
	) { }

	async ngOnInit() {
		await this.redirectUserIfNotAllowed();
		this.availableTags = (await firstValueFrom(this.tagService.getTags())).map(tag => tag.label);
		this.filteredTags = this.profileForm.get("personnalProfile.tagInput")?.valueChanges.pipe(
			startWith(null),
			map((tag: string | null) => (tag ? this.filterTags(tag) : this.availableTags.slice())),
		);
		this.isLoading = false;
	}

	async redirectUserIfNotAllowed() {
		if (!(await this.authService.isLoggedIn()))
			this.router.navigate([""]);
		if (await this.profileService.userHasProfile())
			this.router.navigate(["/app"]);
	}

	async onSubmit() {
		this.isLoading = true;
		
		const picturesIds = await this.uploadAndGetPicturesIds();
		if (!picturesIds) {
			this.isLoading = false;
			return;
		}
		const formValue = this.profileForm.getRawValue();
		const newProfile = {
			...formValue.personnalProfile,
			...formValue.sexualProfile,
			picturesIds
		} as NewProfile;
		
		this.profileService.createProfile(newProfile)
			.subscribe({
				next: () => {
					this.isLoading = false;
					this.router.navigate(["/app"]);
				},
				error: () => this.isLoading = false				
			})		
	}

	async uploadAndGetPicturesIds(): Promise<ProfilePicturesIds | undefined> {
		const presignedPictures = await firstValueFrom(this.pictureService.generateMultipleUploadUrl(this.pictures.additionnalPictures.length + 1));
		try {
			await this.uploadPicture(presignedPictures[presignedPictures.length - 1].uploadUrl, this.pictures.profilePicture?.file);
			for (let i = 0; i < this.pictures.additionnalPictures.length; i++)
				await this.uploadPicture(presignedPictures[i].uploadUrl, this.pictures.additionnalPictures[i].file);
			return {
				profilePicture: presignedPictures[presignedPictures.length - 1].id,
				additionnalPicture: presignedPictures.slice(0, this.pictures.additionnalPictures.length).map(picture => picture.id)
			}
		} catch (error: any) {
			this.firstFillingProfileMode = FirstFillingProfileMode.INTRO;
			this.snackBar.open("Error uploading picture. Try again.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return undefined;
		}
	}

	// NAVIGATION 

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

	// TAGS

	addTagFromInput(event: MatChipInputEvent): void {
		const value = event.value || "";

		if (value) this.addTag(value);
		event.chipInput!.clear();
	}

	addTagFromAutocompletion(event: MatAutocompleteSelectedEvent): void {
		this.addTag(event.option.viewValue);
	}

	addTag(inputTag: string) {
		inputTag = inputTag.trim().toLowerCase();
		this.availableTags = this.availableTags.filter(tag => tag.trim().toLowerCase() !== inputTag);
		this.profileForm.get("personnalProfile.tags")?.value?.push(inputTag);
		this.profileForm.get("personnalProfile.tags")?.updateValueAndValidity();
		this.profileForm.get("personnalProfile.tagInput")?.setValue(null);
	}

	removeTag(tag: string): void {
		const index = this.profileForm.get("personnalProfile.tags")?.value?.indexOf(tag);

		if (index !== undefined && index !== -1) {
			this.availableTags.push(tag);
			this.profileForm.get("personnalProfile.tags")?.value?.splice(index, 1);
			this.profileForm.get("personnalProfile.tags")?.updateValueAndValidity();
		}
	}

	private filterTags(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.availableTags.filter(tag => tag.toLowerCase().includes(filterValue));
	}

	// PICTURES

	updatePictures(pictures: DisplayableProfilePictures) {
		this.pictures = pictures;
	}

	async uploadPicture(uploadUrl: string, file?: File) {
		if (!file) throw new Error();
		await fetch(uploadUrl, {
			method: 'PUT',
			body: file,
			headers: {
				'Content-Type': "image/jpeg",
			}
		});
	}
}
