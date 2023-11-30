import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Event } from '@shared-models/interactions.model';
import { firstValueFrom } from 'rxjs';
import { EventService } from 'src/app/service/event.service';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';

@Component({
	selector: 'date-planner-display-event',
	templateUrl: './date-planner-display-event.component.html',
	styleUrls: ['./date-planner-display-event.component.css', '../../../../styles/dialog.css', '../../../../styles/picture.css', '../../../../styles/buttons.css']
})
export class DatePlannerDisplayEventComponent {
	@Input() event: Event | undefined = undefined;

	@Output() closedWindow = new EventEmitter<null>();
	@Output() deletedEvent = new EventEmitter<string>();

	editMode = false;

	getFirebasePictureUrl = getFirebasePictureUrl;

	constructor(
		private snackBar: MatSnackBar,
		private eventService: EventService,
		private router: Router
	) {}

	onCancel() {
		this.closedWindow.emit();
	}

	navigateToProfile() {
		this.router.navigate([`/app/profile`], { queryParams: { id: this.event?.targetUserId } });
	}

	async deleteEvent() {
		await firstValueFrom(this.eventService.deleteEvent(this.event?.id || ""));
		this.snackBar.open("Event successfully deleted.", "Close", {
			duration: 4000,
			panelClass: "success-snackbar"
		});
		this.deletedEvent.emit(this.event?.id);
		this.onCancel();

	}
}