import { Component, OnInit } from '@angular/core';
import { environment } from '@environment/environment';
import { NavbarProfile } from '@shared-models/profile.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';
import { ProfileService } from 'src/app/service/profile.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';

@Component({
  selector: 'app-user-informations',
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.css']
})
export class UserInformationsComponent implements OnInit {
	
	profile: NavbarProfile = {};
	mySubscriptions: Subscription[] = [];

	environment = environment;

	constructor(
		private authService: AuthService,
		private profileService: ProfileService
	) {}

	ngOnInit(): void {
		this.mySubscriptions.push(this.authService.getCurrentUserObs().subscribe({
			next: (currentUser) => {
				if (!currentUser) return;
				this.profile.firstName = currentUser.firstName;
				this.profile.lastName = currentUser.lastName;
				this.profile.username = currentUser.username;
			}
		}));
		this.mySubscriptions.push(this.profileService.getProfileObs().subscribe({
			next: (profile) => {
				if (!profile) return;
				this.profile.profilePictureUrl = getFirebasePictureUrl(profile.picturesIds?.profilePicture as string);
				this.profile.fameRate = profile.fameRate;
			}
		}))
		this.profile.matchesNb = 250;
		this.profile.likesNb = 640;
		this.profile.fameRate = 76;
	}

	ngOnDestroy() {
		this.mySubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
