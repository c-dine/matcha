import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { picturesIdsToPicturesUrls } from 'src/app/utils/picture.utils';
import { ProfileFilters, User, UserList } from '@shared-models/user.model';
import { UserService } from 'src/app/service/user.service';
import { LikeService } from 'src/app/service/like.service';
import { take } from 'rxjs';
import { ActivitySocketService } from 'src/app/service/socket/activitySocket.service';
import { AnimationOptions } from 'ngx-lottie';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-dating',
	templateUrl: './dating.component.html',
	styleUrls: ['./dating.component.css'],
})
export class DatingComponent implements OnInit {
	isLoading = true;
	matchingProfiles: User[] = [];
	filters: ProfileFilters = { batchSize: 5, offset: 0 };
	picturesUrl: string[] = [];
	options: AnimationOptions = {
		path: 'https://lottie.host/37ff62b2-f4d8-4944-95ad-8085c464f170/KaVE0hl8N1.json'
	}
	picturesIdsToPicturesUrls = picturesIdsToPicturesUrls;

	constructor(
		private userService: UserService,
		private likeService: LikeService,
		private activitySocket: ActivitySocketService,
		private snackbar: MatSnackBar,
	) { }

	ngOnInit() {
		this.initializeComponent();
	}

	private initializeComponent() {
		this.loadMatchingProfiles();
	}

	private loadMatchingProfiles() {
		this.isLoading = true;
		this.userService.getMatchingProfiles(this.filters).subscribe({
			next: (userList: UserList) => {
				this.handleMatchingProfilesLoaded(userList);
			},
			error: () => {
				this.isLoading = false;
			},
		});
	}

	private handleMatchingProfilesLoaded(userList: UserList) {
		this.filters.offset += userList.totalUserCount;
		this.matchingProfiles = userList.userList;
		this.isLoading = false;
	}

	async onDatingButtonClick(buttonName: string) {
		if (!(await this.userService.getCurrentUserValue())?.picturesIds?.profilePicture) {
			this.snackbar.open("You need to upload a profile picture to be able to like.", 'Close', {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}
		if (buttonName === 'like') {
			this.likeSubscribeAndNewActivity();
		}
		else if (buttonName === 'dislike') {
			this.dislikeSubscribeAndNewActivity();
		}
		this.removeTopMatchingProfile();
		if (this.matchingProfiles.length === 0) {
			this.loadMatchingProfiles();
		}
	}

	private likeSubscribeAndNewActivity() {
		if (this.matchingProfiles[0].id) {
			this.likeService.likeProfile(this.matchingProfiles[0]).pipe(take(1)).subscribe();
			this.profileLikedCurrentUser(this.matchingProfiles[0])
				? this.activitySocket.newActivity('match', this.matchingProfiles[0].id)
				: this.activitySocket.newActivity('like', this.matchingProfiles[0].id);
		}
	}

	private profileLikedCurrentUser(profile: User) {
		return profile?.likedCurrentUser !== undefined && profile?.likedCurrentUser;
	}

	private dislikeSubscribeAndNewActivity() {
		if (this.matchingProfiles[0].id) {
			this.likeService.dislikeProfile(this.matchingProfiles[0].id).pipe(take(1)).subscribe();
			this.activitySocket.newActivity('dislike', this.matchingProfiles[0].id)
		}
	}

	private removeTopMatchingProfile() {
		this.matchingProfiles.shift();
	}

	hasMatchingProfiles() {
		return this.matchingProfiles.length > 0;
	}
}