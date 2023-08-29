import { Component } from '@angular/core';
import { NotificationDto } from 'src/typing';

@Component({
  selector: 'app-notifications-side-bar',
  templateUrl: './notifications-side-bar.component.html',
  styleUrls: ['./notifications-side-bar.component.css']
})
export class NotificationsSideBarComponent {
  notificationMessages: NotificationDto[] = [
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': false,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': false,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    }
  ];

  notificationActivity: NotificationDto[] = [
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    },
    {
      'user': {
        'profilePictureUrl': "https://plus.unsplash.com/premium_photo-1663047595510-65abd9c1162e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
        'firstName': "John",
        'lastName': "Doe",
        'likesNb': 250,
        'matchesNb': 64,
        'fameRate': 76,
      },
      'viewed': true,
      'message': 'Content of the message or something else',
      "date": new Date(),
    }
  ];
}
