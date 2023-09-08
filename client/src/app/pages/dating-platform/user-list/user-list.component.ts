import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
		batchSize: 8,
		offset: 0
	});
	userList: UserProfile[] = [];
	environment = environment;

	totalUserCount: number = 0;
	page: number = 1;

	constructor(
		private profileService: ProfileService,
		private router: Router
	) {}

	ngOnInit() {
		this.getUserList();
	}

	getUserList() {
		this.isLoading = true;
		this.profileService.getUserList(this.filtersSubject.getValue()).subscribe({
			next: (userList) => {
				this.totalUserCount = Number(userList.totalUserCount);
				this.userList = userList.userList;
				this.isLoading = false;
			},
			error: () => {
				this.isLoading = false;
			}
		})
	}

	setFilters(filters: ProfileFilters) {
		if (!filters.offset)
			this.page = 1;
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

	goToPreviousPage() {
		if (this.page <= 1) return;
		let filters = this.filtersSubject.getValue();
		filters.offset = filters.offset - filters.batchSize;
		this.filtersSubject.next(filters);
		this.page--;
		this.getUserList();
	}

	goToNextPage() {
		if (this.page > this.totalUserCount / this.filtersSubject.getValue().batchSize + 1) return;
		let filters = this.filtersSubject.getValue();
		filters.offset = filters.offset + filters.batchSize;
		this.filtersSubject.next(filters);
		this.page++;
		this.getUserList();
	}

	changePage(page: number) {
		let filters = this.filtersSubject.getValue();
		filters.offset = (page - 1) * filters.batchSize ;
		this.filtersSubject.next(filters);
		this.page = page;
		this.getUserList();
	}

	navigateToProfile(profileId: string | undefined) {
		if (!profileId) return;
		this.router.navigate([`/app/profile`], { queryParams: { id: profileId } });
	}
}
