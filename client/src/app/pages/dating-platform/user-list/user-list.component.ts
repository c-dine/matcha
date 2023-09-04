import { Component } from '@angular/core';
import { environment } from '@environment/environment';
import { ProfileFilters, UserProfile } from '@shared-models/profile.model';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from 'src/app/service/profile.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

	isLoading = true;
	filtersSubject = new BehaviorSubject<ProfileFilters>({
		batchSize: 15,
		offset: 0
	});
	userList: UserProfile[] = [];
	environment = environment;

	constructor(
		private profileService: ProfileService
	) {}

	ngOnInit() {
		this.getUserList();
	}

	getUserList() {
		this.isLoading = true;
		let filters = this.filtersSubject.getValue();
		this.profileService.getUserList(filters).subscribe({
			next: (userList) => {
				this.userList = userList;
				filters.offset += userList.length;
				this.filtersSubject.next(filters);
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
			}
		})
	}

	setFilters(filters: ProfileFilters) {
		this.filtersSubject.next(filters);
		this.getUserList();
	}

	setTagFilter(tag: string) {
		let filters = this.filtersSubject.getValue();
		filters.tags = [tag];
		filters.offset = 0;
		this.filtersSubject.next(filters);
		this.getUserList();
	}
}
