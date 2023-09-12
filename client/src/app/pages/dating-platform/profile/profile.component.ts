import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@environment/environment';
import { Profile, UserProfile } from '@shared-models/profile.model';
import { firstValueFrom } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../../../styles/buttons.css']
})
export class ProfileComponent {

	environment = environment;
	profile: UserProfile | null = null;

	currentUserProfile!: Profile | null;
	isEditMode = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private profileService: ProfileService,
		private location: Location
	) { }

	async ngOnInit() {
		this.currentUserProfile = await firstValueFrom(this.profileService.getProfileObs());
		this.route.queryParamMap.subscribe(async params => {
			if (params.has("id"))
				this.profileService.getUserProfile(params.get("id") as string).subscribe({
					next: (profile) => this.profile = profile,
					error: async () => await this.getCurrentUserProfile()
				});
			else
				this.getCurrentUserProfile();
		})
	}

	async getCurrentUserProfile() {
		this.profileService.getUserProfile(this.currentUserProfile?.id as string).subscribe({
			next: (profile) => this.profile = profile,
			error: () => this.router.navigate(["/app/userList"])
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

	onSubmitProfile() {
		this.isEditMode = false;

	}
}
