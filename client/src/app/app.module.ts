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
import { HttpClientModule } from '@angular/common/http';
import { PasswordRecoveryComponent } from './pages/home/login-dialog/password-recovery/password-recovery.component';
import { MatIconModule } from '@angular/material/icon';
import { LoginDialogComponent } from './pages/home/login-dialog/login-dialog.component';
import { LoginComponent } from './pages/home/login-dialog/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginDialogComponent,
    PasswordRecoveryComponent,
    LoginComponent,
    SigninDialogComponent,
  ],
  imports: [
    MatIconModule,
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    DatingPlatformModule
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
