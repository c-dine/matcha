import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { ProfileService } from 'src/app/service/profile.service';
import { Profile, ProfileFilters, UserList, UserProfile } from '@shared-models/profile.model';
import { picturesIdsToPicturesUrls } from 'src/app/utils/picture.utils';

import { SocketService } from 'src/app/service/socket.service';

@Component({
	selector: 'app-dating',
	templateUrl: './dating.component.html',
	styleUrls: ['./dating.component.css']
})
export class DatingComponent implements OnInit {
	isLoading: boolean;
	matchingProfiles!: UserProfile[];
	filters: ProfileFilters;
	picturesUrl!: string[];
	picturesIdsToPicturesUrls = picturesIdsToPicturesUrls;

	constructor(
		private profileService: ProfileService,
		private socketService: SocketService,
	) {
		this.isLoading = true;
		this.picturesUrl = [];
		this.filters = {
			batchSize: 5,
			offset: 0
		};
	}

	async ngOnInit() {
		this.getMatchingProfiles();
	}

	onDatingButtonClick() {
		this.matchingProfiles = this.matchingProfiles.slice(1, this.matchingProfiles.length);
		if (!this.matchingProfiles.length) {
			this.getMatchingProfiles();
		}
	}

	private getMatchingProfiles() {
		this.isLoading = true;
		this.profileService.getMatchingProfiles(this.filters).subscribe({
			next: (userList: UserList) => {
				console.log(userList.totalUserCount);
				this.filters.offset += userList.totalUserCount;
				this.matchingProfiles = userList.userList;
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
			}
		})
	}

	hasMatchingProfiles() {
		return this.matchingProfiles?.length;
	}
}
