import { Component } from '@angular/core';
import { NavigationButton } from './typing';

@Component({
  selector: 'app-navigation-list',
  templateUrl: './navigation-list.component.html',
  styleUrls: ['./navigation-list.component.css']
})
export class NavigationListComponent {
  navLinks: NavigationButton[] = [
    {
      title: 'Dating',
      path: '/app/',
      iconName: "favorite"
    },
    {
      title: 'Users',
      path: '/app/users',
      iconName: "groupe"
    },
    {
      title: 'Chat',
      path: '/app/chat',
      iconName: "chat"
    },
    {
      title: 'Activity',
      path: '/app/activity',
      iconName: "diversity_1"
    },
    {
      title: 'Profile',
      path: '/app/profile',
      iconName: "person"
    },
  ];

  settingsNav: NavigationButton = {
    title: 'Settings',
    path: '/settings',
    iconName: "settings"
  }

}
