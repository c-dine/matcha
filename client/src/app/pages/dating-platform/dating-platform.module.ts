import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatingPlatformRoutingModule } from './dating-platform-routing.module';
import { DatingPlatformComponent } from './dating-platform.component';
import { ChatComponent } from './chat/chat.component';
import { DatingComponent } from './dating/dating.component';
import { ProfileComponent } from './profile/profile.component';
import { DatingButtonComponent } from './dating/dating-button/dating-button.component';
import { DatingCardDescriptionComponent } from './dating/dating-card-description/dating-card-description.component';
import { DatingCardPassionsComponent } from './dating/dating-card-passions/dating-card-passions.component';
import { ContactsSideBarComponent } from './chat/contacts-side-bar/contacts-side-bar.component';
import { ContactCardComponent } from './chat/contacts-side-bar/contact-card/contact-card.component';
import { ConversationComponent } from './chat/conversation/conversation.component';
import { ChatMatchBarComponent } from './chat/contacts-side-bar/chat-match-bar/chat-match-bar.component';
import { ChatMessageComponent } from './chat/conversation/chat-message/chat-message.component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from "../../shared/shared.module";
import { UserListFiltersComponent } from './user-list/user-list-filters/user-list-filters.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SettingsComponent } from './settings/settings.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { InteractiveMapComponent } from './interactive-map/interactive-map.component';
import { ChatTypingMessageComponent } from './chat/conversation/typing-message/chat-typing-message.component';
import { LottieModule } from 'ngx-lottie';
import { DatePlannerComponent } from './date-planner/date-planner.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { DatePlannerHeaderComponent } from './date-planner/date-planner-header/date-planner-header.component';
import { DatePlannerAddEventComponent } from './date-planner/date-planner-add-event/date-planner-add-event.component';
import { DatePlannerDisplayEventComponent } from './date-planner/date-planner-display-event/date-planner-display-event.component';
import { playerFactory } from 'src/app/app.module';

@NgModule({
	declarations: [
		DatingPlatformComponent,
		ChatComponent,
		DatingComponent,
		ProfileComponent,
		DatingButtonComponent,
		DatingCardDescriptionComponent,
		DatingCardPassionsComponent,
		ChatComponent,
		ChatTypingMessageComponent,
		ContactsSideBarComponent,
		ContactCardComponent,
		ConversationComponent,
		ChatMatchBarComponent,
		ChatMessageComponent,
		ProfileComponent,
		UserListComponent,
		UserListFiltersComponent,
		SettingsComponent,
		InteractiveMapComponent,
		DatePlannerComponent,
		DatePlannerHeaderComponent,
		DatePlannerAddEventComponent,
		DatePlannerDisplayEventComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		MatIconModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatFormFieldModule,
		MatButtonModule,
		MatDialogModule,
		ReactiveFormsModule,
		FormsModule,
		DatingPlatformRoutingModule,
		MatInputModule,
		MatRadioModule,
		MatTooltipModule,
		SharedModule,
		MatSelectModule,
		NgxPaginationModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatTableModule,
		MatProgressSpinnerModule,
		MatTabsModule,
		MatCheckboxModule,
		LottieModule.forRoot({ player: playerFactory }),
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory,
		}),
	]
})
export class DatingPlatformModule { }
