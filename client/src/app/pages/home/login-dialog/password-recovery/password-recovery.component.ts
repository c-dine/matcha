import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginDialogMode } from '../login-dialog.component';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-password-recovery',
    templateUrl: './password-recovery.component.html',
    styleUrls: ['./password-recovery.component.css', '../../../../styles/dialog.css', '../../../../styles/form.css']
})
export class PasswordRecoveryComponent {
    @Output() changedDialogMode = new EventEmitter<LoginDialogMode>();

    emailForm: FormGroup = new FormGroup({
		email: new FormControl('', [Validators.required, Validators.email]),
    });
    mailSent = false;

    constructor(
    	private authService: AuthService,
    ) {}

    async onSubmit() {
		this.emailForm.markAllAsTouched();
		if (this.emailForm.invalid) return;
		this.mailSent = true;
		this.authService.resetPassword(String(this.emailForm.get('email')?.value));
    }

    goBackToLoginDialog() {
        this.changedDialogMode.emit("login");
    }
}
  