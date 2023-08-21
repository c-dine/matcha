import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { LoginDialogMode } from '../login-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../../styles/dialog.css', '../../../../styles/form.css']
})
export class LoginComponent {
    username: string = "";
    password: string = "";

    @Output() changedDialogMode = new EventEmitter<LoginDialogMode>();

    constructor(
    	private authService: AuthService,
		private router: Router,
		private matDialogRef: MatDialogRef<LoginComponent>,
		private snackBar: MatSnackBar
    ) {}

	async ngOnInit() {
		if (await this.authService.isLoggedIn()) {
			this.matDialogRef.close();
			this.router.navigate(['/app']);
		}
	}

    onSubmit() {
		if (!this.username || !this.password) {
			this.snackBar.open("Please enter your logins.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"	
			});
			return;
		}
		this.authService.login({ username: this.username, password: this.password })
			.subscribe({
				next: () => {
					this.matDialogRef.close();
					this.router.navigate(['/app']);
				},
				error: () => {}
			});
    }

    recoverPassword(){
        this.changedDialogMode.emit("passwordRecovery");
    }
}
  