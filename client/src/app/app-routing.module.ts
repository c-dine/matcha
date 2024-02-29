import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DatingPlatformComponent } from './pages/dating-platform/dating-platform.component';
import { FirstProfileFillingComponent } from './pages/home/first-profile-filling/first-profile-filling.component';
import { PageNotFoundComponent } from './pages/home/404/404.component';

const routes: Routes = [
	{ path: 'fillProfile', component: FirstProfileFillingComponent },
	{ path: 'app', loadChildren: () => import('./pages/dating-platform/dating-platform.module').then(m => m.DatingPlatformModule) },
	{ path: '404', component: PageNotFoundComponent },
	{ path: '', component: HomeComponent },
	{ path: '**', redirectTo: "/404" },
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {enableTracing: true})],
	exports: [RouterModule]
})
export class AppRoutingModule { }
