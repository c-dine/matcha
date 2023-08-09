import { Component } from '@angular/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css', '../../../styles/dialog.css', '../../../styles/form.css']
  })
  export class LoginComponent {
    username: string = "";
    password: string = "";

    onSubmit() {
    }
  }
  