import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { LoginDialogMode } from '../login-dialog.component';

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

    async onSubmit() {
		if (!this.username || !this.password) return;
		const loggedUser = await this.authService.login({
			username: this.username,
			password: this.password
		})
		if (!loggedUser) return;
		this.matDialogRef.close();
        this.router.navigate(['/app']);
    }

    recoverPassword(){
        this.changedDialogMode.emit("passwordRecovery");
    }
}
  