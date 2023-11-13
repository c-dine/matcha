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
      path: '/app',
      iconName: "favorite"
    },
    {
      title: 'Users',
      path: '/app/userList',
      iconName: "groupe"
    },
    {
      title: 'Interactive map',
      path: '/app/interactiveMap',
      iconName: "map"
    },
    {
      title: 'Chat',
      path: '/app/chat',
      iconName: "chat"
    },
    {
      title: 'Profile',
      path: '/app/profile',
      iconName: "person"
    },
  ];

  settingsNav: NavigationButton = {
    title: 'Settings',
    path: '/app/settings',
    iconName: "settings"
  }

}
