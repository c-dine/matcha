import { Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import { ProfileFilters, UserListFilters } from "@shared-models/user.model";
import { BehaviorSubject } from "rxjs";

@Component({
	selector: 'app-user-list-filters',
	templateUrl: './user-list-filters.component.html',
	styleUrls: ['./user-list-filters.component.css']
})
export class UserListFiltersComponent {

	@Input() filters!: ProfileFilters;
	tagsSubject: BehaviorSubject<string[] | undefined> = new BehaviorSubject<string[] | undefined>(undefined);
	@Output() addedFilter = new EventEmitter<ProfileFilters>()

	age = UserListFilters.age;
	fame = UserListFilters.fame;
	distance = UserListFilters.distance;

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