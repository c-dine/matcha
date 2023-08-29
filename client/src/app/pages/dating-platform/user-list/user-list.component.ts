import { Component } from '@angular/core';
import { Profile, ProfileFilters } from '@shared-models/profile.model';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

	isLoading = true;
	userList: Profile[] = [];
	filters: ProfileFilters = {};

	BATCH_SIZE = 15;
	offset = 0;

	constructor(
		private profileService: ProfileService
	) {}

	ngOnInit() {
		this.getUserList();
	}

	getUserList() {
		this.isLoading = true;
		this.profileService.getUserList(this.filters, this.BATCH_SIZE, this.offset).subscribe({
			next: (userList) => {
				this.userList = userList;
				this.offset += this.BATCH_SIZE;
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
			}
		})
	}

	setTagsFilter(tags: string[]) {
		this.filters.tags = tags;
		this.offset = 0;
		this.getUserList();
	}

}
