import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { LoginDialogMode } from '../login-dialog.component';
import { catchError, map } from 'rxjs';

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
		private matDialogRef: MatDialogRef<LoginComponent>
    ) {}

	async ngOnInit() {
		if (await this.authService.isLoggedIn()) {
			this.matDialogRef.close();
			this.router.navigate(['/app']);
		}
	}

    onSubmit() {
		if (!this.username || !this.password) return;
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
  