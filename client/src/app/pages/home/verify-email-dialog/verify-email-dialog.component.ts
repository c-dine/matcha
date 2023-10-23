import { Component, Inject } from "@angular/core";
import { LoginDialogComponent } from "../login-dialog/login-dialog.component";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { UserService } from "src/app/service/user.service";

@Component({
    selector: 'app-verify-email-dialog',
    templateUrl: './verify-email-dialog.component.html',
    styleUrls: ['./verify-email-dialog.component.css', '../../../styles/dialog.css', '../../../styles/form.css']
})
export class VerifyEmailDialogComponent {

	isVerified = false;
	isLoading = true;

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: {
			verificationToken: string
		},
		private dialog: MatDialog,
		private dialogRef: MatDialogRef<VerifyEmailDialogComponent>,
		private userService: UserService,
	) {}

	async ngOnInit() {
		this.userService.verifyEmail(this.data.verificationToken).subscribe(
			() => { 
				this.isVerified = true;
				this.isLoading = false;
			},
			() => this.isLoading = false 
		);
	}

	goBackToLoginDialog() {
		this.dialogRef.close();
		setTimeout(() => this.dialog.open(LoginDialogComponent, {
			autoFocus: false
		}), 200);
	}
}