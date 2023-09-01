import { Component } from '@angular/core';
import { ProfileFilters, UserProfile } from '@shared-models/profile.model';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

	isLoading = true;
	userList: UserProfile[] = [];
	filters: ProfileFilters = {
		batchSize: 15,
		offset: 0
	};

	constructor(
		private profileService: ProfileService
	) {}

	ngOnInit() {
		this.getUserList();
	}

	getUserList() {
		this.isLoading = true;
		this.profileService.getUserList(this.filters).subscribe({
			next: (userList) => {
				this.userList = userList;
				this.filters.offset += userList.length;
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
			}
		})
	}

	setFilters(filters: ProfileFilters) {
		this.filters = filters;
		this.getUserList();
	}
}
