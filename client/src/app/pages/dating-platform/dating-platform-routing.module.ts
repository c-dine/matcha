import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { DatingComponent } from './dating/dating.component';
import { ProfileComponent } from './profile/profile.component';
import { DatingPlatformComponent } from './dating-platform.component';

const routes: Routes = [
  { 
    path: 'app', 
    component: DatingPlatformComponent,
    children: [
      { path: '', component: DatingComponent },
      { path: 'chat', component: ChatComponent },
      { path: 'dating', component: DatingComponent },
      { path: 'profile', component: ProfileComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatingPlatformRoutingModule { }
