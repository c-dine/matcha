import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { minArrayLengthValidator } from 'src/app/validators/custom-validators';

enum FirstFillingProfileMode {
	INTRO = 0,
	SEXUAL_PROFILE = 1,
	PERSONNAL_PROFILE = 2,
	PHOTOS = 3,
	END = 4
}
@Component({
    selector: 'app-first-profile-filling-dialog',
    templateUrl: './first-profile-filling-dialog.component.html',
    styleUrls: ['./first-profile-filling-dialog.component.css', '../../../../styles/dialog.css', '../../../../styles/form.css']
})
export class FirstProfileFillingDialogComponent {

	FirstFillingProfileMode = FirstFillingProfileMode;
	firstFillingProfileMode: number = FirstFillingProfileMode.INTRO;

	separatorKeyCodes: number[] = [ENTER, COMMA];
	availableTags = ['Angular', 'React', 'Vue', 'JavaScript', 'TypeScript', 'HTML', 'CSS'];
	filteredTags: Observable<string[]> | undefined;

	profileForm = new FormGroup({
		sexualProfile: new FormGroup({
			gender: new FormControl<string>('', [ Validators.required ]),
			sexualPreferences: new FormControl<string>('', [ Validators.required ])
		}),
		personnalProfile: new FormGroup({
			biography: new FormControl<string>('', [ Validators.required, Validators.minLength(50) ]),
			tagInput: new FormControl<string | null>('', []),
			selectedTags: new FormControl<string[]>([], [ Validators.required, minArrayLengthValidator(3) ]),
		}),
	});

	constructor() {
		this.filteredTags = this.profileForm.get("personnalProfile.tagInput")?.valueChanges.pipe(
			startWith(null),
			map((tag: string | null) => (tag ? this.filterTags(tag) : this.availableTags.slice())),
		);
	}

	onSubmit() {

	}


	canGoNext() {
		switch(this.firstFillingProfileMode) {
			case FirstFillingProfileMode.SEXUAL_PROFILE:
				if (this.profileForm.get("sexualProfile")?.invalid)
					return false;
				break;
			case FirstFillingProfileMode.PERSONNAL_PROFILE:
				if (this.profileForm.get("personnalProfile")?.invalid)
					return false;
				break;
		}
		return true;
	}

	onSwitchNextModeClick() {
		this.firstFillingProfileMode = 
			this.firstFillingProfileMode === FirstFillingProfileMode.END ?
			FirstFillingProfileMode.END : this.firstFillingProfileMode + 1;
	}

	onSwitchPreviousModeClick() {
		this.firstFillingProfileMode = 
			this.firstFillingProfileMode === FirstFillingProfileMode.INTRO ?
			FirstFillingProfileMode.INTRO : this.firstFillingProfileMode - 1;
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
		this.profileForm.get("personnalProfile.selectedTags")?.value?.push(inputTag);
		this.profileForm.get("personnalProfile.selectedTags")?.updateValueAndValidity();
		this.profileForm.get("personnalProfile.tagInput")?.setValue(null);
	}

	removeTag(tag: string): void {
		const index = this.profileForm.get("personnalProfile.selectedTags")?.value?.indexOf(tag);

		if (index !== undefined && index !== -1) {
			this.availableTags.push(tag);
			this.profileForm.get("personnalProfile.selectedTags")?.value?.splice(index, 1);
			this.profileForm.get("personnalProfile.selectedTags")?.updateValueAndValidity();
		}
	}

	private filterTags(value: string): string[] {
		const filterValue = value.toLowerCase();
	
		return this.availableTags.filter(tag => tag.toLowerCase().includes(filterValue));
	}
}
  