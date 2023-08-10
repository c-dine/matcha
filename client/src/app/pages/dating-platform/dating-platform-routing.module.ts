import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { DatingComponent } from './dating/dating.component';
import { ProfileComponent } from './profile/profile.component';
import { DatingPlatformComponent } from './dating-platform.component';
import { AuthGuard } from 'src/app/service/authGuard.service';

const routes: Routes = [
  { 
    path: 'app', 
    component: DatingPlatformComponent,
    children: [
      { path: '', component: DatingComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'dating', component: DatingComponent },
      { path: 'profile', component: ProfileComponent }
    ],
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatingPlatformRoutingModule { }
