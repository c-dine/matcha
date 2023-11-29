import { Component, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'date-planner-display-event',
	templateUrl: './date-planner-display-event.component.html',
	styleUrls: ['./date-planner-display-event.component.css']
})
export class DatePlannerDisplayEventComponent {
	@Output() closedWindow = new EventEmitter<Event | null>();
}