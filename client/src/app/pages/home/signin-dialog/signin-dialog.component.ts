import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { passwordValidator } from 'src/app/validators/custom-validators';

@Component({
    selector: 'app-signin-dialog',
    templateUrl: './signin-dialog.component.html',
	styleUrls: ['./signin-dialog.component.css', '../../../styles/dialog.css', '../../../styles/form.css', '../../../styles/buttons.css']
})
export class SigninDialogComponent {

	constructor(
		private authService: AuthService,
		private router: Router,
		private matDialogRef: MatDialogRef<SigninDialogComponent>
	) {}

    newUserForm: FormGroup = new FormGroup({
		username: new FormControl('', Validators.required),
		firstName: new FormControl('', Validators.required),
		lastName: new FormControl('', Validators.required),
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required, passwordValidator]),
    });

    onSubmit() {
		this.newUserForm.markAllAsTouched();
		if (this.newUserForm.invalid)
        	return;
		this.authService.signIn(this.newUserForm.getRawValue())
			.subscribe({
				next: () => {
					this.matDialogRef.close();
					this.router.navigate(['/app']);
				},
				error: () => {}
			});
    }
  }
  