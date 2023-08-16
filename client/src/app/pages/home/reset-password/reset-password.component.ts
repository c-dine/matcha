import { Component, Inject } from "@angular/core";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/service/auth.service";

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css', '../../../styles/dialog.css', '../../../styles/form.css']
})
export class ResetPasswordComponent {

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
		private dialogRef: MatDialogRef<ResetPasswordComponent>,
		private authService: AuthService
	) {}

	onSubmit() {
		if (this.resetPasswordForm.invalid)	return;
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