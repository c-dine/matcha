import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css', '../../../styles/dialog.css', '../../../styles/form.css']
})
export class SigninComponent {

	constructor(
		private authService: AuthService,
		private router: Router,
		private matDialogRef: MatDialogRef<SigninComponent>
	) {}

    newUserForm: FormGroup = new FormGroup({
		username: new FormControl('', Validators.required),
		firstName: new FormControl('', Validators.required),
		lastName: new FormControl('', Validators.required),
		email: new FormControl('', [Validators.required, Validators.email]),
		password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });

    async onSubmit() {
      	if (this.newUserForm.invalid)
        	return;
		const signedUser = await this.authService.signIn(this.newUserForm.getRawValue());
		if (!signedUser) return;
		this.matDialogRef.close();
        this.router.navigate(['/app']);
    }
  }
  