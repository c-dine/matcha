import { Component, Inject } from "@angular/core";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/service/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password-dialog.component.html',
    styleUrls: ['./reset-password-dialog.component.css', '../../../styles/dialog.css', '../../../styles/form.css', '../../../styles/buttons.css']
})
export class ResetPasswordDialogComponent {

    resetPasswordForm: FormGroup = new FormGroup({
		password: new FormControl('', [Validators.required, Validators.minLength(6)]),
		passwordConfirmation: new FormControl('', [Validators.required])
    });
	passwordReset = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: {
			resetToken: string
		},
		private dialog: MatDialog,
		private snackBar: MatSnackBar,
		private dialogRef: MatDialogRef<ResetPasswordDialogComponent>,
		private authService: AuthService
	) {}

	onSubmit() {
		if (this.resetPasswordForm.invalid)	return;
		if (this.resetPasswordForm.get('password')?.getRawValue() !== this.resetPasswordForm.get('passwordConfirmation')?.getRawValue()) {
			this.snackBar.open("Password don't match.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}
		this.passwordReset = true;
		this.authService.resetPassword(this.data.resetToken, this.resetPasswordForm.get('password')?.getRawValue());
	}

	goBackToLoginDialog() {
		this.dialogRef.close();
		setTimeout(() => this.dialog.open(LoginDialogComponent, {
			autoFocus: false
		}), 200);
	}
}