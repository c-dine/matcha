import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
	selector: 'date-planner-header',
	templateUrl: './date-planner-header.component.html',
	styleUrls: ['./date-planner-header.component.css']
})
export class DatePlannerHeaderComponent {
	@Input() view!: CalendarView;

	@Input() viewDate!: Date;

	@Input() locale: string = 'en';

	@Output() viewChange = new EventEmitter<CalendarView>();

	@Output() viewDateChange = new EventEmitter<Date>();

	@Output() updateEvents = new EventEmitter();

	CalendarView = CalendarView;

	getDaySuffix(day: number): string {
		if (day >= 11 && day <= 13) {
			return 'th';
		}
		switch (day % 10) {
			case 1:
				return 'st';
			case 2:
				return 'nd';
			case 3:
				return 'rd';
			default:
				return 'th';
		}
	}

	getEvents() {
		this.updateEvents.emit();
	}
}