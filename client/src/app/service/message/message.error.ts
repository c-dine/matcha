import { Injectable } from '@angular/core';
import { ErrorBase } from 'src/app/shared/errorBase/errorBase';

export enum MessageErrorCode {
	NoConversationSelected = 'NoConversationSelected',
	EmptyMessage = 'EmptyMessage',
	OverMaxLenth = 'OverMaxLenth',

}

@Injectable({
	providedIn: 'root'
})
export class MessageError extends ErrorBase {
	constructor() {
		super();
		this.errorMessages.set(
			MessageErrorCode.NoConversationSelected,
			'No conversation selected'
		);
		this.errorMessages.set(
			MessageErrorCode.EmptyMessage,
			'The message is empty'
		);
		this.errorMessages.set(
			MessageErrorCode.OverMaxLenth,
			'The message is too long'
		);
	}
};
