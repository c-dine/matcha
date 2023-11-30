import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { firstValueFrom } from "rxjs";
import { EventService } from "src/app/service/event.service";

@Component({
	selector: 'app-date-planner',
	templateUrl: './date-planner.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	styleUrls: ['./date-planner.component.css']
})
export class DatePlannerComponent {
	view: CalendarView = CalendarView.Week;
	viewDate: Date = new Date();
	events: CalendarEvent[] = [];
	openedWindow: "addEvent" | "editEvent" | null = null;

	constructor(
		private eventService: EventService
	) { }

	async ngOnInit() {
		this.eventService.getEvents(
			this.getStartOfPeriod(),
			this.getEndOfPeriod()
		).subscribe(events => {
			this.events = events.map(event => ({
				...event,
				start: new Date(event.start as Date),
				end: new Date(event.end as Date),
			} as CalendarEvent))
		});
	}

	addEvent() {
		this.openedWindow = "addEvent";
	}

	closeWindow() {
		this.openedWindow = null;
	}

	handleDateClick(day: { date: Date; events: CalendarEvent[] }): void {
	}

	private getStartOfPeriod(): Date {
		const date = new Date(this.viewDate);
		switch (this.view) {
			case CalendarView.Week:
				date.setDate(date.getDate() - date.getDay());
				break;
			case CalendarView.Month:
				return new Date(date.getFullYear(), date.getMonth(), 1);
		}
		date.setHours(0, 0, 0);
		return date;
	}

	private getEndOfPeriod(): Date {
		let date = new Date(this.viewDate);
		switch (this.view) {
			case CalendarView.Week:
				date.setDate(date.getDate() + (6 - date.getDay()));
				break;
			case CalendarView.Month:
				date = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
		}
		date.setHours(23, 59, 59);
		return date;
	}
}