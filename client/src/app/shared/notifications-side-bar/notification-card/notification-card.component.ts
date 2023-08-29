import { Component, Input } from '@angular/core';
import { NotificationDto } from 'src/typing';

@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.css']
})
export class NotificationCardComponent {
  @Input()
  notification!: NotificationDto;
}
