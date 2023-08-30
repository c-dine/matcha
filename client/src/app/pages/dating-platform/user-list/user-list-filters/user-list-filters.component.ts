import { Component, EventEmitter, Output } from "@angular/core";
import { ProfileFilters } from "@shared-models/profile.model";

@Component({
	selector: 'app-user-list-filters',
	templateUrl: './user-list-filters.component.html',
	styleUrls: ['./user-list-filters.component.css']
  })
  export class UserListFiltersComponent {

	filters: ProfileFilters = {
		batchSize: 15,
		offset: 0
	};
	@Output() addedFilter = new EventEmitter<ProfileFilters>()

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
  }