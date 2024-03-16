import { Location, formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environment/environment';
import { DisplayableProfilePictures } from '@shared-models/picture.model';
import { User } from '@shared-models/user.model';
import { firstValueFrom, timer } from 'rxjs';
import { BlacklistService } from 'src/app/service/blacklist.service';
import { FakeReportService } from 'src/app/service/fake-report.service';
import { LikeService } from 'src/app/service/like.service';
import { NotificationService } from 'src/app/service/notification.service';
import { PictureService } from 'src/app/service/picture.service';
import { connectionSocketService } from 'src/app/service/socket/connectionSocket.service';
import { UserService } from 'src/app/service/user.service';
import { ViewService } from 'src/app/service/view.service';
import { SubscriptionBase } from 'src/app/shared/subscriptionBase/subscription-base.component';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { getAge } from 'src/app/utils/profil.utils';
import { ageValidator, dateIsPastDateValidator } from 'src/app/validators/custom-validators';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css', '../../../styles/buttons.css']
})
export class ProfileComponent extends SubscriptionBase {

	getAge = getAge;
	formatDate = formatDate;
	environment = environment;
	profile: User | null = null;
	isConnected: boolean = false;

	profileForm!: FormGroup;
	pictures!: DisplayableProfilePictures;

	useUserGivenLocation!: boolean;

	currentUser!: User | null;
	isEditMode = false;
	isLoading = true;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private userService: UserService,
		private location: Location,
		private snackBar: MatSnackBar,
		private pictureService: PictureService,
		private blacklistService: BlacklistService,
		private fakeReportService: FakeReportService,
		private viewService: ViewService,
		private likeService: LikeService,
		private notificationService: NotificationService,
		private connectionSocket: connectionSocketService,
	) { super() }

	async ngOnInit() {
		this.handleIsUserConnected();
		this.currentUser = await firstValueFrom(this.userService.getCurrentUserObs());
		this.route.queryParamMap.subscribe(async params => {
			if (params.has("id") && params.get("id") !== this.currentUser?.id)
				this.userService.getUserProfile(params.get("id") as string).subscribe({
					next: (profile) => {
						this.profile = profile;
						if (profile?.id) {
							this.viewService.addView(profile);
							this.notificationService.sendNewActivity('view', profile.id);
						}
						this.isLoading = false;
					},
					error: async () => { await this.getCurrentUser(); this.isLoading = false; },
				});
			else {
				await this.getCurrentUser();
				this.isLoading = false;
			}
		});
	}

	async getCurrentUser() {
		this.userService.getUserProfile().subscribe({
			next: (profile) => {
				this.profile = profile;
				this.initForm();
			},
			error: () => this.router.navigate(["/app/userList"])
		});
	}

	initForm() {
		this.pictures = {
			profilePicture: this.currentUser?.picturesIds?.profilePicture ?
				{ id: this.currentUser?.picturesIds?.profilePicture, url: getFirebasePictureUrl(this.currentUser?.picturesIds?.profilePicture) }
				: undefined,
			additionnalPictures: this.currentUser?.picturesIds?.additionnalPicture?.map(id => ({ id, url: getFirebasePictureUrl(id) })) || []
		};
		this.profileForm = new FormGroup({
			gender: new FormControl<string>(this.currentUser?.gender || "", [Validators.required]),
			sexualPreferences: new FormControl<string>(this.currentUser?.sexualPreferences || "", [Validators.required]),
			birthDate: new FormControl<Date | undefined>(this.currentUser?.birthDate, [Validators.required, dateIsPastDateValidator(), ageValidator(18)]),
			biography: new FormControl<string>(this.currentUser?.biography || "", [Validators.maxLength(500)]),
			tags: new FormControl<string[]>(this.currentUser?.tags || []),
			userGivenLongitude: new FormControl<number>({ value: this.currentUser?.userGivenLocation?.longitude || 0, disabled: !this.currentUser?.userGivenLocation }),
			userGivenLatitude: new FormControl<number>({ value: this.currentUser?.userGivenLocation?.latitude || 0, disabled: !this.currentUser?.userGivenLocation }),
		});
		this.useUserGivenLocation = !!this.currentUser?.userGivenLocation;
	}

	changedUseUserGivenLocation() {
		this.useUserGivenLocation = !this.useUserGivenLocation;
		if (this.useUserGivenLocation) {
			this.profileForm.get('userGivenLongitude')?.enable();
			this.profileForm.get('userGivenLatitude')?.enable();
		}
		else {
			this.profileForm.get('userGivenLongitude')?.disable();
			this.profileForm.get('userGivenLatitude')?.disable();
		}
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
		if (!this.profile.picturesIds) {
			this.isLoading = false;
			this.snackBar.open("An error occurred while uploading the pictures.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}

		this.isEditMode = false;
		const formValue = this.profileForm?.getRawValue();
		this.currentUser = await firstValueFrom(this.userService.updateUser({
			...this.profile,
			...formValue,
			picturesIds: this.profile.picturesIds,
			userGivenLocation: this.useUserGivenLocation ? {
				longitude: formValue.userGivenLongitude,
				latitude: formValue.userGivenLatitude
			} : null
		} as User));
		this.profile = {
			...this.profile,
			...this.currentUser as User
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

	async onBlacklistUserClick() {
		if (this.profile?.id)
			await firstValueFrom(this.blacklistService.addBlacklisted(this.profile?.id));
	}

	async onUnblacklistUserClick() {
		if (this.profile?.id)
			await firstValueFrom(this.blacklistService.deleteBlacklisted(this.profile?.id));
	}

	async onReportUserClick() {
		if (this.profile?.id) {
			await firstValueFrom(this.fakeReportService.addFakeReported(this.profile?.id));
		};
	}

	async onDeleteUserReportClick() {
		if (this.profile?.id)
			await firstValueFrom(this.fakeReportService.deleteFakeReported(this.profile?.id));
	}

	async onLikeProfileClick() {
		if (!this.profile?.id) return;
		if (!this.checkIfUserCanLikeProfileAndAlert()) return;
		if (this.profile.isLiked !== undefined && this.profile.isLiked)
			return this.unlikeProfile();
		await firstValueFrom(this.likeService.likeProfile(this.profile));
		if (this.profileLikedCurrentUser()) {
			this.notificationService.sendNewActivity('match', this.profile?.id);
		}
		else
			this.notificationService.sendNewActivity('like', this.profile?.id);
		this.updateProfileStats("like");
		this.profile.isLiked = true;
	}

	async onDislikeProfileClick() {
		if (!this.profile?.id) return;
		if (!this.checkIfUserCanLikeProfileAndAlert()) return;
		if (this.profile.isLiked !== undefined && !this.profile.isLiked)
			return this.unlikeProfile();
		await firstValueFrom(this.likeService.dislikeProfile(this.profile.id));
		this.notificationService.sendNewActivity('dislike', this.profile?.id);
		this.updateProfileStats("dislike");
		this.profile.isLiked = false;
	}

	checkIfUserCanLikeProfileAndAlert(): boolean {
		const canLikeProfile = !!this.currentUser?.picturesIds?.profilePicture;

		if (!canLikeProfile)
			this.snackBar.open("You need to have a profile picture to interract with a profile.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
		return canLikeProfile;
	}

	async unlikeProfile() {
		if (!this.profile?.id) return;
		await firstValueFrom(this.likeService.unlikeProfile(this.profile.id));
		this.notificationService.sendNewActivity('unlike', this.profile?.id);
		this.updateProfileStats("unlike");
		this.profile.isLiked = undefined;
	}

	updateProfileStats(updateType: "like" | "unlike" | "dislike") {
		if ((!this.profile?.stats?.likeCount && this.profile?.stats?.likeCount !== 0)
			|| (!this.profile?.stats?.dislikeCount && this.profile?.stats?.dislikeCount !== 0))
			return;
		switch (updateType) {
			case "like":
				this.profile.stats.likeCount += 1;
				if (this.isProfileDisliked())
					this.profile.stats.dislikeCount -= 1;
				break;
			case "dislike":
				this.profile.stats.dislikeCount += 1;
				if (this.isProfileLiked())
					this.profile.stats.likeCount -= 1;
				break;
			case "unlike":
				if (this.isProfileLiked())
					this.profile.stats.likeCount -= 1;
				else
					this.profile.stats.dislikeCount -= 1;
		}
	}

	isProfileBlacklisted() {
		return this.blacklistService.isProfileBlocked(this.profile?.id || "");
	}

	isProfileReported() {
		return this.fakeReportService.isProfileReported(this.profile?.id || "");
	}

	isProfileLiked() {
		return this.profile?.isLiked !== undefined && this.profile?.isLiked;
	}

	isProfileDisliked() {
		return this.profile?.isLiked !== undefined && !this.profile?.isLiked;
	}

	profileLikedCurrentUser() {
		return this.profile?.likedCurrentUser !== undefined && this.profile?.likedCurrentUser;
	}

	private handleIsUserConnected() {
		this.listentIfUserConnected();
		this.askIfUserConnectedEvery(3000);
	}

	private askIfUserConnectedEvery(timeInterval: number): void {
		const intervalSub = timer(500, timeInterval).subscribe(
			() => {
				if (!this.profile?.id) return;
				this.connectionSocket.askIfConnected(this.profile.id)
			})
		this.saveSubscription(intervalSub);
	}

	private listentIfUserConnected() {
		const sub = this.connectionSocket.getisConnected().subscribe({
			next: (resp) => this.isConnected = (resp.message) === "connected",
		})
		this.saveSubscription(sub);
	}
}
