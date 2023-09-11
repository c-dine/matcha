import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dating',
  templateUrl: './dating.component.html',
  styleUrls: ['./dating.component.css']
})
export class DatingComponent {
  firstName: string = 'Celine';
  lastName: string = 'Dine';
  location: string = '1cm from you'
  resume: string = "Je m'appelle celine et je ne pense qu'a manger. Ca fait seulement 1 jour que j'ai commence mon regime et j'en peux deja plus... pfiou c'est trop dur"
  picturesUrl = [
	"https://images.unsplash.com/photo-1682687218608-5e2522b04673?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
	"https://plus.unsplash.com/premium_photo-1681406994502-bb673c265877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
	"https://images.unsplash.com/photo-1682687221006-b7fd60cf9dd0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
  ]

  onDatingButtonClick() {
    console.log("test");
  }
}
