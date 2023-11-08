import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AuthService } from './service/auth.service';
import { AuthGuard } from './service/authGuard.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpInterceptorService } from './service/httpInterceptor.service';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomeModule } from './pages/home/home.module';
import { DatingPlatformModule } from './pages/dating-platform/dating-platform.module';


@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		HomeModule,
		DatingPlatformModule,
	],
	providers: [
		AuthService,
		AuthGuard,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpInterceptorService,
			multi: true
		},
		{
			provide: MAT_DATE_LOCALE, 
			useValue: 'fr-FR'
		},		
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
