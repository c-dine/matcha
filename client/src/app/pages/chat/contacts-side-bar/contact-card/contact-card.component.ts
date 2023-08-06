import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent {
  @Input()
  user!: UserDto;

  @Input()
  activated!: boolean;
}
