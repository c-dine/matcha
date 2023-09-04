import { Component, EventEmitter, Input, Output } from "@angular/core";
import { ProfileFilters } from "@shared-models/profile.model";
import { BehaviorSubject, Observable, Subscription } from "rxjs";

@Component({
	selector: 'app-user-list-filters',
	templateUrl: './user-list-filters.component.html',
	styleUrls: ['./user-list-filters.component.css']
  })
  export class UserListFiltersComponent {

	@Input() filtersObservable!: Observable<ProfileFilters>;
	filters!: ProfileFilters;
	tagsSubject: BehaviorSubject<string[] | undefined> = new BehaviorSubject<string[] | undefined>(undefined);
	@Output() addedFilter = new EventEmitter<ProfileFilters>()

	mySubcriptions: Subscription[] = [];

	ngOnInit() {
		this.mySubcriptions.push(
			this.filtersObservable.subscribe({
				next: (filters) => {
					this.filters = filters;
					this.tagsSubject?.getValue() !== filters.tags && this.tagsSubject?.next(filters.tags);
				}
			})
		);
	}

	ngOnDestroy() {
		this.mySubcriptions.forEach(subscription => subscription.unsubscribe());
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
  }