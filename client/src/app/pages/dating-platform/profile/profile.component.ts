import { Location, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environment/environment';
import { DisplayableProfilePictures } from '@shared-models/picture.model';
import { Profile, UserProfile } from '@shared-models/profile.model';
import { firstValueFrom } from 'rxjs';
import { PictureService } from 'src/app/service/picture.service';
import { ProfileService } from 'src/app/service/profile.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { getAge } from 'src/app/utils/profil.utils';
import { ageValidator, dateIsPastDateValidator, minArrayLengthValidator } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../styles/buttons.css']
})
export class ProfileComponent {

	getAge = getAge;
	formatDate = formatDate;
	environment = environment;
	profile: UserProfile | null = null;

	profileForm!: FormGroup;
	pictures!: DisplayableProfilePictures;

	currentUserProfile!: Profile | null;
	isEditMode = false;
	isLoading = true;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private profileService: ProfileService,
		private location: Location,
		private snackBar: MatSnackBar,
		private pictureService: PictureService
	) { }

	async ngOnInit() {
		this.currentUserProfile = await firstValueFrom(this.profileService.getProfileObs());
		this.route.queryParamMap.subscribe(async params => {
			if (params.has("id"))
				this.profileService.getUserProfile(params.get("id") as string).subscribe({
					next: (profile) => { this.profile = profile; this.isLoading = false; },
					error: async () => { await this.getCurrentUserProfile(); this.isLoading = false; },
				});
			else {
				await this.getCurrentUserProfile();
				this.isLoading = false;
			}
		});
	}

	async getCurrentUserProfile() {
		this.profileService.getUserProfile(this.currentUserProfile?.id as string).subscribe({
			next: (profile) => {
				this.profile = profile;
				this.initForm();
			},
			error: () => this.router.navigate(["/app/userList"])
		});
	}

	initForm() {
		this.pictures = {
			profilePicture: this.currentUserProfile?.picturesIds?.profilePicture ? 
				{ id: this.currentUserProfile?.picturesIds?.profilePicture, url: getFirebasePictureUrl(this.currentUserProfile?.picturesIds?.profilePicture) }
				: undefined,
			additionnalPictures: this.currentUserProfile?.picturesIds?.additionnalPicture?.map(id => ({ id, url: getFirebasePictureUrl(id)})) || []
		};
		this.profileForm  = new FormGroup({
			gender: new FormControl<string>(this.currentUserProfile?.gender || "", [Validators.required]),
			sexualPreferences: new FormControl<string>(this.currentUserProfile?.sexualPreferences || "", [Validators.required]),
			birthDate: new FormControl<Date | undefined>(this.currentUserProfile?.birthDate, [Validators.required, dateIsPastDateValidator(), ageValidator(18)]),
			biography: new FormControl<string>(this.currentUserProfile?.biography || "", [Validators.required, Validators.minLength(50), Validators.maxLength(500)]),
			tags: new FormControl<string[]>(this.currentUserProfile?.tags || [], [Validators.required, minArrayLengthValidator(3)]),
		});
	}

	onGoBackClick() {
		this.location.back();
	}

	getPicturesUrl() {
		return [
			getFirebasePictureUrl(this.profile?.picturesIds?.profilePicture),
			...this.profile?.picturesIds?.additionnalPicture ?
				this.profile?.picturesIds?.additionnalPicture?.map(getFirebasePictureUrl)
				: []
		];
	}

	onEditProfile() {
		this.isEditMode = true;
	}

	async onSubmitProfile() {
		this.isLoading = true;
		if (!this.profile || this.profileForm?.invalid) {
			this.isLoading = false;
			this.snackBar.open("Invalid profile.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}
		if (!this.pictures.profilePicture && this.pictures.additionnalPictures.length) {
			this.pictures.profilePicture = this.pictures.additionnalPictures[0];
			this.pictures.additionnalPictures.splice(0, 1);
		}
		this.profile.picturesIds = await this.pictureService.uploadAndGetPicturesIds(this.pictures);
		if (!this.profile.picturesIds){
			this.isLoading = false;
			this.snackBar.open("An error occurred while uploading the pictures.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}

		this.isEditMode = false;
		this.currentUserProfile = await firstValueFrom(this.profileService.updateProfile({
				...this.profileForm?.getRawValue(),
				picturesIds: this.profile.picturesIds
			} as Profile));
		this.profile = {
			...this.profile,
			...this.currentUserProfile as UserProfile
		};
		this.isLoading = false;
	}

	onCancelEditProfile() {
		this.initForm();
		this.isEditMode = false;
	}

	setTags(tags: string[]) {
		if (!this.profileForm) return;
		this.profileForm.get("tags")?.setValue(tags);
	}
	
	updatePictures(pictures: DisplayableProfilePictures) {
		this.pictures = pictures;
	}
}
