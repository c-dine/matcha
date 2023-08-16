import { Component } from '@angular/core';

export type LoginDialogMode = "login" | "passwordRecovery" | "resetPassword";

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.css', '../../../styles/dialog.css', '../../../styles/form.css']
})
export class LoginDialogComponent {
    
	mode: LoginDialogMode = "login";

    changeDialogMode(mode: LoginDialogMode) {
        this.mode = mode;
    }
}
  