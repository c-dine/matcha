import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Subject } from "rxjs";

@Component({
	selector: 'app-tags-popup',
	templateUrl: './tags-popup.component.html',
	styleUrls: ['./tags-popup.component.css', '../../../styles/filters.css', '../../../styles/buttons.css']
})
export class TagsPopupComponent {

	@Input() label!: string;
	@Input() description!: string;
	@Input() max!: number;
	@Output() appliedValue = new EventEmitter<string[]>()

	resetTagsSubject = new Subject<void>();
	tags!: string[];

	onResetClick() {
		this.tags = [];
		this.appliedValue.emit([]);
		this.resetTagsSubject.next();
	}

	onApplyClick() {
		this.appliedValue.emit(
			this.tags
		);
	}

	setTags(tags: any) {
		this.tags = tags;
	}
} 