import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { SigninDialogComponent } from './pages/home/signin-dialog/signin-dialog.component';
import { DatingPlatformModule } from './pages/dating-platform/dating-platform.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './service/authGuard.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { PasswordRecoveryComponent } from './pages/home/login-dialog/password-recovery/password-recovery.component';
import { MatIconModule } from '@angular/material/icon';
import { LoginDialogComponent } from './pages/home/login-dialog/login-dialog.component';
import { LoginComponent } from './pages/home/login-dialog/login/login.component';
import { ResetPasswordComponent } from './pages/home/reset-password/reset-password.component';
import { VerifyEmailDialogComponent } from './pages/home/verify-email-dialog/verify-email-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { HttpInterceptorService } from './service/httpInterceptor.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FirstProfileFillingComponent } from './pages/home/first-profile-filling/first-profile-filling.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ProfilePicturesComponent } from './shared/profile-pictures/profile-pictures.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		LoginDialogComponent,
		PasswordRecoveryComponent,
		LoginComponent,
		SigninDialogComponent,
		ResetPasswordComponent,
		VerifyEmailDialogComponent,
		SpinnerComponent,
		FirstProfileFillingComponent,
		ProfilePicturesComponent
	],
	imports: [
		MatIconModule,
		HttpClientModule,
		BrowserModule,
		AppRoutingModule,
		ReactiveFormsModule,
		FormsModule,
		MatDialogModule,
		DatingPlatformModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		BrowserAnimationsModule,
		MatInputModule,
		MatFormFieldModule,
		MatRadioModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatProgressBarModule
	],
	providers: [
		AuthService,
		AuthGuard,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpInterceptorService,
			multi: true
		},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
