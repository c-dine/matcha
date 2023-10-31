import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { picturesIdsToPicturesUrls } from 'src/app/utils/picture.utils';
import { ActivitySocketService } from 'src/app/service/socket/activitySocket.service';
import { ChatSocketService } from 'src/app/service/socket/chatSocket.service';
import { ProfileFilters, User, UserList } from '@shared-models/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
	selector: 'app-dating',
	templateUrl: './dating.component.html',
	styleUrls: ['./dating.component.css']
})
export class DatingComponent implements OnInit {
	isLoading: boolean;
	matchingProfiles!: User[];
	filters: ProfileFilters;
	picturesUrl!: string[];
	picturesIdsToPicturesUrls = picturesIdsToPicturesUrls;

	constructor(
		private userService: UserService,
		private activitySocket: ActivitySocketService,
		private chatSocket: ChatSocketService
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
		this.userService.getMatchingProfiles(this.filters).subscribe({
			next: (userList: UserList) => {
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
