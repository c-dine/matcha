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
				this.filters.offset += this.filters.batchSize;
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
			}
		})
	}

	setTagsFilter(tags: string[]) {
		this.filters.tags = tags;
		this.filters.offset = 0;
		this.getUserList();
	}

	setAgeGapFilter(gap: { min: number, max: number }) {
		this.filters.ageMax = gap.max;
		this.filters.ageMin = gap.min;
		this.filters.offset = 0;
		this.getUserList();
	}

	setFameGapFilter(gap: { min: number, max: number }) {
		this.filters.fameRateMax = gap.max;
		this.filters.fameRateMin = gap.min;
		this.filters.offset = 0;
		this.getUserList();
	}

}
