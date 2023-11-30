import { Component } from "@angular/core";
import { Event } from "@shared-models/interactions.model";
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { EventService } from "src/app/service/event.service";

@Component({
	selector: 'app-date-planner',
	templateUrl: './date-planner.component.html',
	styleUrls: ['./date-planner.component.css']
})
export class DatePlannerComponent {
	view: CalendarView = CalendarView.Week;
	viewDate: Date = new Date();

	calendarEvents: CalendarEvent[] | undefined = undefined;
	events: Event[] = [];
	
	openedWindow: "addEvent" | "displayEvent" | null = null;
	displayedEvent: Event | undefined = undefined;

	constructor(
		private eventService: EventService
	) { }

	async ngOnInit() {
		this.eventService.getEvents(this.getStartOfPeriod(), this.getEndOfPeriod()).subscribe(events => {
			this.calendarEvents = events as CalendarEvent[]
			this.events = events;
		});
	}

	openAddEventWindow() {
		this.openedWindow = "addEvent";
	}

	deleteEvent(eventId: string) {
		this.calendarEvents = this.calendarEvents?.filter(event => event.id !== eventId);
		this.events = this.events?.filter(event => event.id !== eventId);
	}

	closeWindow() {
		this.openedWindow = null;
	}

	displayEvent(event: any) {
		this.displayedEvent = this.events.find(event_ => event_.id === event.event.id);
		this.openedWindow = 'displayEvent';
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