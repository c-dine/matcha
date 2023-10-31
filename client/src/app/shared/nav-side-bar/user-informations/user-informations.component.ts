import { Component, OnInit } from '@angular/core';
import { environment } from '@environment/environment';
import { Profile } from '@shared-models/profile.model';
import { User } from '@shared-models/user.model';
import { Subscription } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';
import { UserService } from 'src/app/service/user.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';

@Component({
  selector: 'app-user-informations',
  templateUrl: './user-informations.component.html',
  styleUrls: ['./user-informations.component.css']
})
export class UserInformationsComponent implements OnInit {
	
	profile!: Profile;
	user!: User;
	mySubscriptions: Subscription[] = [];

	environment = environment;

	constructor(
		private userService: UserService,
		private profileService: ProfileService
	) {}

	getFirebasePictureUrl = getFirebasePictureUrl;

	ngOnInit(): void {
		this.mySubscriptions.push(
			this.profileService.getCurrentUserProfileObs().subscribe({
				next: (profile) => {
					if (!profile) return;
					this.profile = profile;
				}
			})
		);
		this.mySubscriptions.push(this.userService.getCurrentUserObs().subscribe({
			next: (currentUser) => {
				if (!currentUser) return;
				this.user = currentUser;
			}
		}));
	}

	ngOnDestroy() {
		this.mySubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}
}
