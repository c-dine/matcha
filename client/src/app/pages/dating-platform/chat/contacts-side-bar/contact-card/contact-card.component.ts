import { Component, Input } from '@angular/core';
import { Conversation } from '@shared-models/chat.models';
import { getFirebasePictureUrl } from 'src/app/utils/picture.utils';

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrls: ['./contact-card.component.css']
})
export class ContactCardComponent {
  @Input()
  conversation!: Conversation;

  @Input()
  activated!: boolean;

  pictureIdToUrl(id: string) {
	return getFirebasePictureUrl(id);
  }
}
