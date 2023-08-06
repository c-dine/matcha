import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { NavSideBarComponent } from './nav-side-bar/nav-side-bar.component';
import { NotificationsSideBarComponent } from './notifications-side-bar/notifications-side-bar.component';
import { UserInformationsComponent } from './nav-side-bar/user-informations/user-informations.component';
import { NavigationListComponent } from './nav-side-bar/navigation-list/navigation-list.component';
import { NavigationElementComponent } from './nav-side-bar/navigation-list/navigation-element/navigation-element.component';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { BoxComponent } from './notifications-side-bar/box/box.component';
import { NotificationCardComponent } from './notifications-side-bar/notification-card/notification-card.component';

@NgModule({
  declarations: [
    HeaderComponent,
    NavSideBarComponent,
    NotificationsSideBarComponent,
    UserInformationsComponent,
    NavigationListComponent,
    NavigationElementComponent,
    BoxComponent,
    NotificationCardComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    MatDividerModule,
  ],
  exports: [
    HeaderComponent,
    NavSideBarComponent,
    NotificationsSideBarComponent,
  ]
})
export class SharedModule { }
