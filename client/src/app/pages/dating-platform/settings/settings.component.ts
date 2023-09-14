import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { User } from "@shared-models/user.model";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/service/auth.service";

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css', '../../../styles/buttons.css']
})
export class SettingsComponent {

	currentUser: User | undefined;
	userForm!: FormGroup;
	isUserDetailsEditMode = false;

	mySubscriptions: Subscription[] = [];

	constructor(
		private authService: AuthService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit() {
		this.mySubscriptions.push(
			this.authService.getCurrentUserObs().subscribe({
				next: (user) => this.currentUser = user
			})
		);
	}

	onEditUserDetails() {
		this.isUserDetailsEditMode = true;
		this.initUserForm();
	}

	oSubmitUserDetails() {
		if (this.userForm.invalid) {
			this.snackBar.open("Some fields have invalid values.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}
		this.authService.updateUser(this.userForm.getRawValue()).subscribe({
			next: (user) => { this.currentUser = user; this.isUserDetailsEditMode = false; }
		});
	}

	onCancelUserDetails() {
		this.isUserDetailsEditMode = false;
		this.initUserForm();
	}

	initUserForm() {
		this.userForm = new FormGroup({
			firstName: new FormControl(this.currentUser?.firstName),
			lastName: new FormControl(this.currentUser?.lastName),
			email: new FormControl(this.currentUser?.email, [Validators.required, Validators.email]),
			username: new FormControl(this.currentUser?.username, [Validators.required]),
		});
	}
}