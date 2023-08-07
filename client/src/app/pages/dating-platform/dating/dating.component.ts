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

  onDatingButtonClick() {
    console.log("test");
  }
}
