import { Component } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  logoUrl: string = '/assets/logo-matcha.png';

  constructor(
    private authService: AuthService
  ) {}

  logOut() {
      this.authService.logout();
  }
}
