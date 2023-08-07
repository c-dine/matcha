import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(
    private dialog: MatDialog
  ) {}

  onLogInClick() {
    this.dialog.open(LoginComponent, {
      autoFocus: false
    });
  }

  onSignInClick() {
    this.dialog.open(SigninComponent, {
      autoFocus: false
    });
  }

}
