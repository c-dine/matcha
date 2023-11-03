export enum MessageErrorCode {
	NoConversationSelected = 'NoConversationSelected',
}

class MessageError {
	private errorMessages: Map<MessageErrorCode, string> = new Map();

	constructor() {
		this.errorMessages.set(
			MessageErrorCode.NoConversationSelected,
			'No conversation selected'
		);
	}

	handleError(errorCode: MessageErrorCode): void {
		const errorMessage = this.errorMessages.get(errorCode);

		if (errorMessage) {
			this.logError(errorMessage);
		}
	}

	logError(message: string): void {
		console.error(message);
	}
}

export default new MessageError();