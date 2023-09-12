import { COMMA, ENTER, SPACE } from "@angular/cdk/keycodes";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from "@angular/material/chips";
import { BehaviorSubject, Observable, Subscription, firstValueFrom, map, startWith } from "rxjs";
import { TagService } from "src/app/service/tag.service";
import { minArrayLengthValidator } from "src/app/validators/custom-validators";

@Component({
	selector: 'app-tag-input',
	templateUrl: './tag-input.component.html',
	styleUrls: ['./tag-input.component.css', '../../styles/dialog.css', '../../styles/form.css', '../../styles/buttons.css']
})
export class TagInputComponent {

	@Input() parentResetTagsObservable!: Observable<void>;
	@Input() tagsSubject!: BehaviorSubject<string[] | undefined>;
	@Input() parentTagsInput!: string[] | undefined;
	@Input() label!: string;
	@Input() minArrayLength!: number;
	@Output() addedTag = new EventEmitter<string[]>();

	mySubscriptions: Subscription[] = [];

	separatorKeyCodes: number[] = [ENTER, COMMA, SPACE];
	availableTags!: string[];
	filteredTags: Observable<string[]> | undefined;

	tagFormField = new FormGroup({
		tagInput: new FormControl<string | null>('', []),
		tags: new FormControl<string[] | undefined>([], [minArrayLengthValidator(this.minArrayLength)]),
	});

	constructor(
		private tagService: TagService
	) { }

	async ngOnInit() {
		if (this.parentResetTagsObservable)
			this.mySubscriptions.push(
				this.parentResetTagsObservable.subscribe({
					next: () => this.resetTags()
				})
			);
		this.availableTags = (await firstValueFrom(this.tagService.getTags())).map(tag => tag.label);
		this.filteredTags = this.tagFormField.get("tagInput")?.valueChanges.pipe(
			startWith(null),
			map((tag: string | null) => (tag ? this.filterTags(tag) : this.availableTags.slice())),
		);
		if (this.tagsSubject)
			this.mySubscriptions.push(
				this.tagsSubject.asObservable().subscribe({
					next: (tags) => {
						this.availableTags.push(...this.tagFormField.get("tags")?.value || []);
						this.tagFormField.get("tags")?.setValue(tags || []);
						
						if (tags) {
							this.availableTags = this.availableTags.filter(tag => !tags.includes(tag));
							this.tagFormField.get("tagInput")?.setValue(null);
						}
					}
				})
			);
		if (this.parentTagsInput)
			this.tagFormField.get("tags")?.setValue(this.parentTagsInput);
	}
	
	ngOnDestroy() {
		this.mySubscriptions.forEach(subscription => {
			subscription.unsubscribe();
		});
	}

	resetTags() {
		this.availableTags.push(...this.tagFormField.get('tags')?.getRawValue());
		this.tagFormField.get('tags')?.setValue([]);
	}

	addTagFromInput(event: MatChipInputEvent): void {
		const value = event.value || "";

		if (value) this.addTag(value);
		event.chipInput!.clear();
	}

	addTagFromAutocompletion(event: MatAutocompleteSelectedEvent): void {
		this.addTag(event.option.viewValue);
	}

	addTag(inputTag: string) {
		inputTag = inputTag.trim().toLowerCase();
		this.availableTags = this.availableTags.filter(tag => tag.trim().toLowerCase() !== inputTag);
		this.tagFormField.get("tags")?.value?.push(inputTag);
		this.tagFormField.get("tags")?.updateValueAndValidity();
		this.tagFormField.get("tagInput")?.setValue(null);
		this.addedTag.emit(this.tagFormField.get("tags")?.getRawValue());
	}

	removeTag(tag: string): void {
		const index = this.tagFormField.get("tags")?.value?.indexOf(tag);

		if (index !== undefined && index !== -1) {
			this.availableTags.push(tag);
			this.tagFormField.get("tags")?.value?.splice(index, 1);
			this.tagFormField.get("tags")?.updateValueAndValidity();
			this.addedTag.emit(this.tagFormField.get("tags")?.getRawValue());
		}
	}

	private filterTags(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.availableTags.filter(tag => tag.toLowerCase().includes(filterValue));
	}
}