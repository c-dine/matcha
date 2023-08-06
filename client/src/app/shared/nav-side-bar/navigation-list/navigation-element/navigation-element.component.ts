import { Component, Input, OnInit } from '@angular/core';
import { NavigationButton } from '../typing';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-element',
  templateUrl: './navigation-element.component.html',
  styleUrls: ['./navigation-element.component.css']
})
export class NavigationElementComponent {
  @Input()
  navigationButton!: NavigationButton;

  constructor(public router: Router) { }

  onContinue() {
    this.router.navigateByUrl(this.navigationButton.path);
  }
}
