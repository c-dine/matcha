import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatingComponent } from './pages/dating/dating.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ChatComponent } from './pages/chat/chat.component';

const routes: Routes = [
  { path: '', component: DatingComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'chat', component: ChatComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
