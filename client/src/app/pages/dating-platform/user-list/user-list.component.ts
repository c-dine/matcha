import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { ProfileFilters, User } from '@shared-models/user.model';
import { Subscription, firstValueFrom } from 'rxjs';
import { UserService } from 'src/app/service/user.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';
import { getAge } from 'src/app/utils/profil.utils';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {

	isLoading = true;
	filters: ProfileFilters = { batchSize: 8, offset: 0 };
	userList: User[] = [];
	environment = environment;
	getFirebasePictureUrl = getFirebasePictureUrl;
	getAge = getAge;

	totalUserCount: number = 0;
	page: number = 1;

	mySubscription: Subscription[] = [];

	constructor(
		private userService: UserService,
		private router: Router
	) {}

	ngOnInit() {
		this.mySubscription.push(
			this.userService.getUserListFiltersObs().subscribe({
				next: (filters) => {
					this.filters = filters;
					this.page = filters.offset / filters.batchSize + 1;
				}
			})
		);
		this.getUserList();
	}

	async getUserList() {
		this.isLoading = true;
		const userList = await firstValueFrom(this.userService.getUserList(this.filters));
		this.totalUserCount = Number(userList.totalUserCount);
		this.userList = userList.userList;
		this.isLoading = false;
	}

	setFilters(filters: ProfileFilters) {
		if (!filters.offset)
			this.page = 1;
		this.userService.setUserListFilters(filters);
		this.getUserList();
	}

	setTagFilter(tag: string) {
		this.filters.tags = [tag];
		this.filters.offset = 0;
		this.userService.setUserListFilters(this.filters);
		this.getUserList();
	}

	goToPreviousPage() {
		if (this.page <= 1) return;
		this.filters.offset = this.filters.offset - this.filters.batchSize;
		this.userService.setUserListFilters(this.filters);
		this.page--;
		this.getUserList();
	}

	goToNextPage() {
		if (this.page > this.totalUserCount / this.filters.batchSize + 1) return;
		this.filters.offset = this.filters.offset + this.filters.batchSize;
		this.userService.setUserListFilters(this.filters);
		this.page++;
		this.getUserList();
	}

	changePage(page: number) {
		this.filters.offset = (page - 1) * this.filters.batchSize ;
		this.userService.setUserListFilters(this.filters);
		this.page = page;
		this.getUserList();
	}

	navigateToProfile(userId: string | undefined) {
		if (!userId) return;
		this.router.navigate([`/app/profile`], { queryParams: { id: userId } });
	}
}
