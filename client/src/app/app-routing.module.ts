import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DatingPlatformComponent } from './pages/dating-platform/dating-platform.component';
import { FirstProfileFillingComponent } from './pages/home/first-profile-filling/first-profile-filling.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'fillProfile', component: FirstProfileFillingComponent },
  { path: 'app', component: DatingPlatformComponent, outlet: 'app' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
