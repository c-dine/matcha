import { ChangeDetectionStrategy, Component } from "@angular/core";
import { CalendarEvent, CalendarView } from 'angular-calendar';

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

	addEvent() {
		this.openedWindow = "addEvent";
	}

	closeWindow() {
		this.openedWindow = null;
	}
}