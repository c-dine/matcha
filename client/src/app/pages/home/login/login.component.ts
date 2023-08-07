import { Component } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../style/dialog.css']
  })
  export class LoginComponent {
    username: string = "";
    password: string = "";

    onSubmit() {
    }
  }
  