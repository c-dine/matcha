import { NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { LoginDialogComponent } from "./login-dialog/login-dialog.component";
import { PasswordRecoveryComponent } from "./login-dialog/password-recovery/password-recovery.component";
import { LoginComponent } from "./login-dialog/login/login.component";
import { SigninDialogComponent } from "./signin-dialog/signin-dialog.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { VerifyEmailDialogComponent } from "./verify-email-dialog/verify-email-dialog.component";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatRadioModule } from "@angular/material/radio";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatNativeDateModule } from "@angular/material/core";
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FirstProfileFillingComponent } from "./first-profile-filling/first-profile-filling.component";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
	declarations: [
		HomeComponent,
		LoginDialogComponent,
		PasswordRecoveryComponent,
		LoginComponent,
		SigninDialogComponent,
		ResetPasswordComponent,
		VerifyEmailDialogComponent,
		FirstProfileFillingComponent
	],
	imports: [
		CommonModule,
		MatIconModule,
		ReactiveFormsModule,
		FormsModule,
		MatDialogModule,
		MatSnackBarModule,
		MatInputModule,
		MatFormFieldModule,
		MatRadioModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatProgressBarModule,
		MatDatepickerModule,
		MatNativeDateModule,
		SharedModule
	]
})
export class HomeModule { }
