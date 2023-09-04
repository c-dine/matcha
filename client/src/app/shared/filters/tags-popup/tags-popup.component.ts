import { Component, EventEmitter, Input, Output } from "@angular/core";
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";

@Component({
	selector: 'app-tags-popup',
	templateUrl: './tags-popup.component.html',
	styleUrls: ['./tags-popup.component.css', '../../../styles/filters.css', '../../../styles/buttons.css']
})
export class TagsPopupComponent {

	@Input() label!: string;
	@Input() description!: string;
	@Input() max!: number;
	@Input() tagsObservable!: Observable<string[] | undefined>;
	tagsSubject: BehaviorSubject<string[] | undefined> = new BehaviorSubject<string[] | undefined>(undefined);
	@Output() appliedValue = new EventEmitter<string[]>()

	resetTagsSubject = new Subject<void>();
	mySubscriptions: Subscription[] = [];

	ngOnInit() {
		this.mySubscriptions.push(
			this.tagsObservable.subscribe({
				next: (tags) => this.tagsSubject.next(tags)
			})
		);
	}

	ngOnDestroy() {
		this.mySubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	onResetClick() {
		this.tagsSubject?.next([]);
		this.appliedValue.emit([]);
		this.resetTagsSubject.next();
	}

	onApplyClick() {
		this.appliedValue.emit(
			this.tagsSubject?.getValue()
		);
	}

	setTags(tags: any) {
		this.tagsSubject?.next(tags);
	}
} 