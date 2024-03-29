import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { DatingComponent } from './dating/dating.component';
import { ProfileComponent } from './profile/profile.component';
import { DatingPlatformComponent } from './dating-platform.component';
import { AuthGuard } from 'src/app/service/authGuard.service';
import { UserListComponent } from './user-list/user-list.component';
import { SettingsComponent } from './settings/settings.component';
import { InteractiveMapComponent } from './interactive-map/interactive-map.component';
import { DatePlannerComponent } from './date-planner/date-planner.component';
import { PageNotFoundComponent } from '../home/404/404.component';

const routes: Routes = [
  { 
    path: '', 
    component: DatingPlatformComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DatingComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'chat/:id', component: ChatComponent },
      { path: 'dating', component: DatingComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'userList', component: UserListComponent },
      { path: 'interactiveMap', component: InteractiveMapComponent },
      { path: 'settings', component: SettingsComponent },
      { path: 'datePlanner', component: DatePlannerComponent },
],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatingPlatformRoutingModule { }
