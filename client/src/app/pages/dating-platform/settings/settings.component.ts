import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Interaction } from "@shared-models/interactions.model";
import { User } from "@shared-models/user.model";
import { Subscription, firstValueFrom } from "rxjs";
import { BlacklistService } from "src/app/service/blacklist.service";
import { FakeReportService } from "src/app/service/fake-report.service";
import { UserService } from "src/app/service/user.service";
import { passwordValidator } from "src/app/validators/custom-validators";

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.css', '../../../styles/buttons.css']
})
export class SettingsComponent {

	currentUser: User | undefined;
	userForm!: FormGroup;
	passwordForm!: FormGroup;
	isUserDetailsEditMode = false;
	isPasswordEditMode = false;

	blacklist!: Interaction[];
	fakeReportList!: Interaction[];

	mySubscriptions: Subscription[] = [];

	constructor(
		private blacklistService: BlacklistService,
		private fakeReportService: FakeReportService,
		private snackBar: MatSnackBar,
		private userService: UserService
	) { }

	ngOnInit() {
		this.mySubscriptions.push(
			this.userService.getCurrentUserObs().subscribe({
				next: (user) => this.currentUser = user
			})
		);
		this.mySubscriptions.push(
			this.blacklistService.getBlacklistObs().subscribe({
				next: (blacklist) => this.blacklist = blacklist
			})
		);
		this.mySubscriptions.push(
			this.fakeReportService.getFakeReportListObs().subscribe({
				next: (fakeReportList) => this.fakeReportList = fakeReportList
			})
		);
		this.initPasswordForm();
		this.passwordForm.disable();
	}

	ngOnDestroy() {
		this.mySubscriptions.forEach(subscription => subscription.unsubscribe());
	}

	// USER DETAILS

	onCancelUserDetailsEdit() {
		this.isUserDetailsEditMode = false;
		this.initUserForm();
	}

	onEditUserDetails() {
		this.isUserDetailsEditMode = true;
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

	onSubmitUserDetails() {
		if (this.userForm.invalid) {
			this.snackBar.open("Some fields have invalid values.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}
		this.userService.updateUser(this.userForm.getRawValue()).subscribe({
			next: (user) => { this.currentUser = user; this.isUserDetailsEditMode = false; }
		});
	}

	// PASSWORD

	onCancelPasswordEdit() {
		this.isPasswordEditMode = false;
		this.initPasswordForm();
		this.passwordForm.disable();
	}

	onEditPassword() {
		this.isPasswordEditMode = true;
		this.passwordForm.enable();
		this.initPasswordForm();
	}

	initPasswordForm() {
		this.passwordForm = new FormGroup({
			lastPassword: new FormControl('', Validators.required),
			newPassword: new FormControl('', [Validators.required, passwordValidator]),
			repeatNewPassword: new FormControl('', [Validators.required, passwordValidator]),
		});
	}

	async onSubmitPassword() {
		if (this.passwordForm.get('newPassword')?.value !== this.passwordForm.get('repeatNewPassword')?.value) {
			this.snackBar.open("Passwords don't match.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}
		if (this.passwordForm.get('newPassword')?.invalid) {
			this.snackBar.open("Password must be at least 8 characters, must contain at least 1 uppercase and 1 digit.", "Close", {
				duration: 4000,
				panelClass: "error-snackbar"
			});
			return;
		}
		this.userService.updatePassword(
			this.passwordForm.get('lastPassword')?.value,
			this.passwordForm.get('newPassword')?.value
			)
			.subscribe({
				next: () => { 
					this.isPasswordEditMode = false;
					this.initPasswordForm();
					this.passwordForm.disable();
				},
				error: () => {}
			});
	}

	// BLACKLIST
	
	async deleteBlacklist(profileId: string) {
		await firstValueFrom(this.blacklistService.deleteBlacklisted(profileId));
	}

	// FAKE REPORT
	
	async deleteFakeReport(profileId: string) {
		await firstValueFrom(this.fakeReportService.deleteFakeReported(profileId));
	}
}