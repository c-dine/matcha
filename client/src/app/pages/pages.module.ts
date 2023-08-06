import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { DatingComponent } from './dating/dating.component';
import { ProfileComponent } from './profile/profile.component';
import { ImageSliderComponent } from './dating/image-slider/image-slider.component';
import { DatingButtonComponent } from './dating/dating-button/dating-button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { DatingCardDescriptionComponent } from './dating/dating-card-description/dating-card-description.component';
import { DatingCardPassionsComponent } from './dating/dating-card-passions/dating-card-passions.component';
import { ChatComponent } from './chat/chat.component';
import { ContactsSideBarComponent } from './chat/contacts-side-bar/contacts-side-bar.component';
import { ContactCardComponent } from './chat/contacts-side-bar/contact-card/contact-card.component';
import { ConversationComponent } from './chat/conversation/conversation.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChatSearchBarComponent } from './chat/contacts-side-bar/chat-search-bar/chat-search-bar.component';
import { ChatMessageComponent } from './chat/conversation/chat-message/chat-message.component';

@NgModule({
  declarations: [
    PagesComponent,
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
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
  ],
  exports: [
    PagesComponent,
  ],
})
export class PagesModule { }
