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
		this.errors.set(
			MessageErrorCode.NoConversationSelected,
			'No conversation selected'
		);
		this.errors.set(
			MessageErrorCode.EmptyMessage,
			'The message is empty'
		);
		this.errors.set(
			MessageErrorCode.OverMaxLenth,
			'The message is too long'
		);
	}
};
