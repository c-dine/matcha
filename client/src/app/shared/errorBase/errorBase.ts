import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
	providedIn: 'root'
})
export abstract class ErrorBase {
	protected errors: Map<any, string> = new Map();
	private snackBar! : MatSnackBar;

	constructor(
	) {
		this.snackBar = inject(MatSnackBar);
	}

	handleError(errorCode: string): void {
		const errorMessage = this.errors.get(errorCode);

		if (errorMessage) {
			this.displayError(errorMessage);
		}
	}

	displayError(message: string): void {
		this.snackBar.open(message, 'Close', {
			duration: 4000,
			panelClass: "error-snackbar"
		});
	}
}