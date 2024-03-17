import { Component, EventEmitter, Input, Output, SimpleChanges, HostListener } from "@angular/core";
import { ProfileFilters, UserListFilters } from "@shared-models/user.model";
import { BehaviorSubject } from "rxjs";

@Component({
	selector: 'app-user-list-filters',
	templateUrl: './user-list-filters.component.html',
	styleUrls: ['./user-list-filters.component.css', '../../../../styles/buttons.css']
})
export class UserListFiltersComponent {

	@Input() filters!: ProfileFilters;
	tagsSubject: BehaviorSubject<string[] | undefined> = new BehaviorSubject<string[] | undefined>(undefined);
	@Output() addedFilter = new EventEmitter<ProfileFilters>()

	age = UserListFilters.age;
	fame = UserListFilters.fame;
	distance = UserListFilters.distance;

	isMobile!: Boolean;
	isFilterMenuOpen!: Boolean;

	ngOnInit() {
		if (window.screen.width <= 800) {
			this.isMobile = true;
			this.isFilterMenuOpen = false;
		} else {
			this.isMobile = false;
			this.isFilterMenuOpen = true;
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		const menu = document.getElementById('filters-settings-container');
		if (event.target.innerWidth <= 800) {
			this.isMobile = true;
			this.isFilterMenuOpen = false;
			(menu as any).style.display = 'none';
		} else {
			this.isMobile = false;
			this.isFilterMenuOpen = true;
			(menu as any).style.display = 'block';
		}
	}
	
	toggleMenu() {
		const menu = document.getElementById('filters-settings-container');
		const buttonDrawer = document.getElementById('filter-button-drawer');
		if (this.isFilterMenuOpen) {
			(menu as any).style.display = 'none';
			(buttonDrawer as any).style.display = 'flex';
		} else {
			(menu as any).style.display = 'block';
			(buttonDrawer as any).style.display = 'none';
		}
		this.isFilterMenuOpen = !this.isFilterMenuOpen;
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['filters'])
			this.tagsSubject?.getValue() !== this.filters.tags && this.tagsSubject?.next(this.filters.tags);
	}

	setTagsFilter(tags: string[]) {
		this.filters.tags = tags;
		this.filters.offset = 0;
		this.addedFilter.emit(this.filters);
	}

	setAgeGapFilter(gap: { min: number, max: number } | undefined) {
		this.filters.ageMax = gap?.max;
		this.filters.ageMin = gap?.min;
		this.filters.offset = 0;
		this.addedFilter.emit(this.filters);
	}

	setFameGapFilter(gap: { min: number, max: number } | undefined) {
		this.filters.fameRateMax = gap?.max;
		this.filters.fameRateMin = gap?.min;
		this.filters.offset = 0;
		this.addedFilter.emit(this.filters);
	}

	setDistanceFilter(distance: number | undefined) {
		this.filters.distanceKilometers = distance;
		this.filters.offset = 0;
		this.addedFilter.emit(this.filters);
	}

	setOrderBy(event: any) {
		this.filters.orderBy = event.value;
		this.filters.offset = 0;
		this.addedFilter.emit(this.filters);
	}

	setOrder(event: any) {
		this.filters.order = event.value;
		this.filters.offset = 0;
		this.addedFilter.emit(this.filters);
	}

	setBatchSize(event: any) {
		this.filters.batchSize = event.value;
		this.filters.offset = 0;
		this.addedFilter.emit(this.filters);
	}
}

// isMobile!: Boolean;
// isSideBarOpen!: Boolean;
// constructor() { }

// ngOnInit() {
// 	if (window.screen.width <= 600) {
// 		this.isMobile = true
// 		this.isSideBarOpen = false;
// 	} else {
// 		this.isMobile = false;
// 		this.isSideBarOpen = true;
// 	}
// }

// @HostListener('window:resize', ['$event'])
// onResize(event: any) {
// 	const menu = document.getElementById('contact-side-bar');
// 	if (event.target.innerWidth <= 600) {
// 		this.isMobile = true
// 		this.isSideBarOpen = false;
// 		(menu as any).style.display = 'none'
// 	} else {
// 		this.isMobile = false;
// 		this.isSideBarOpen = true;
// 		(menu as any).style.display = 'block';
// 	}
// }

// toggleMenu() {
// 	const menu = document.getElementById('contact-side-bar');
// 	(this.isSideBarOpen)
// 		? (menu as any).style.display = 'none'
// 		: (menu as any).style.display = 'block';
// 	this.isSideBarOpen = !this.isSideBarOpen;
// }