import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationDto } from 'src/typing';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent {
  @Input()
  title!: string;

  @Input()
  notifications!: NotificationDto[];

  constructor(private router: Router) {}

  onClickSeeAll(): void {
    this.router.navigateByUrl(this.title.toLowerCase());
  }
}
