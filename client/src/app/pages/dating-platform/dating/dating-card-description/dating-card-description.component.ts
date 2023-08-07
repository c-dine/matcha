import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dating-card-description',
  templateUrl: './dating-card-description.component.html',
  styleUrls: [
    './dating-card-description.component.css',
    '../dating.component.css'
  ]
})
export class DatingCardDescriptionComponent {
  @Input()
  firstName!: string;

  @Input()
  lastName!: string;

  @Input()
  location!: string;

  @Input()
  resume!: string;

  @Output()
  clicked: EventEmitter<any> = new EventEmitter();

  receiveClickEvent(): void {
    this.clicked.emit();
  }
}
