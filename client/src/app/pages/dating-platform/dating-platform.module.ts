// dating-platform.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatingPlatformRoutingModule } from './dating-platform-routing.module';
import { DatingPlatformComponent } from './dating-platform.component';
import { ChatComponent } from './chat/chat.component';
import { DatingComponent } from './dating/dating.component';
import { ProfileComponent } from './profile/profile.component';
import { ImageSliderComponent } from './dating/image-slider/image-slider.component';
import { DatingButtonComponent } from './dating/dating-button/dating-button.component';
import { DatingCardDescriptionComponent } from './dating/dating-card-description/dating-card-description.component';
import { DatingCardPassionsComponent } from './dating/dating-card-passions/dating-card-passions.component';
import { ContactsSideBarComponent } from './chat/contacts-side-bar/contacts-side-bar.component';
import { ContactCardComponent } from './chat/contacts-side-bar/contact-card/contact-card.component';
import { ConversationComponent } from './chat/conversation/conversation.component';
import { ChatSearchBarComponent } from './chat/contacts-side-bar/chat-search-bar/chat-search-bar.component';
import { ChatMessageComponent } from './chat/conversation/chat-message/chat-message.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FirstProfileFillingDialogComponent } from './profile/first-profile-filling-dialog/first-profile-filling-dialog.component';
@NgModule({
  declarations: [
    DatingPlatformComponent,
    ChatComponent,
    DatingComponent,
    DatingComponent,
    ProfileComponent,
    ImageSliderComponent,
    DatingButtonComponent,
    DatingCardDescriptionComponent,
    DatingCardPassionsComponent,
    ChatComponent,
    ContactsSideBarComponent,
    ContactCardComponent,
    ConversationComponent,
    ChatSearchBarComponent,
    ChatMessageComponent,
    ProfileComponent,
	FirstProfileFillingDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    DatingPlatformRoutingModule
  ]
})
export class DatingPlatformModule { }
