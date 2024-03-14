import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '@shared-models/interactions.model';
import { EventService } from 'src/app/service/event.service';

@Component({
	selector: 'date-planner-add-event',
	templateUrl: './date-planner-add-event.component.html',
	styleUrls: ['./date-planner-add-event.component.css', '../../../../styles/dialog.css', '../../../../styles/buttons.css', '../../../../styles/form.css']
})
export class DatePlannerAddEventComponent {
	@Output() closedWindow = new EventEmitter<null>();
	@Output() addedEvent = new EventEmitter<Event>();

	constructor(
		private snackBar: MatSnackBar,
		private eventService: EventService
	) {}

	newEventForm: FormGroup = new FormGroup({
		start: new FormControl<Date>(new Date(), Validators.required),
		end: new FormControl<Date>(new Date(), Validators.required),
		title: new FormControl('', [Validators.required, Validators.maxLength(50)]),
		eventLocation: new FormControl('', [Validators.required, Validators.maxLength(50)]),
		username: new FormControl('', Validators.required),
    });

	onSubmit() {
		if (this.newEventForm.invalid) {
			this.snackBar.open("Some information is missing.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}
		const formValue = this.newEventForm.getRawValue();
		const {start, end} = this.getCorrectDates(formValue.start, formValue.end);
		this.eventService.addEvent({
			...formValue,
			start,
			end,
		}).subscribe({
			next: (event) => this.addedEvent.emit(event) ,
			error: () => { }
		});
	}

	getCorrectDates(start: Date, end: Date) {
		start = new Date(start);
		end = new Date(end);
		return start > end ? { start: end, end: start } : { start, end }; 
	}

	onCancel() {
		this.closedWindow.emit();
	}
}