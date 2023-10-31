import { Component, Input } from '@angular/core';
import { NavbarProfile } from '@shared-models/user.model';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent {
  @Input()
  user!: NavbarProfile;

  @Input()
  activated!: boolean;
}
