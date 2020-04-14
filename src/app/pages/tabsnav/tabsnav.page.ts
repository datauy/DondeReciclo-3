import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-tabsnav',
  templateUrl: './tabsnav.page.html',
  styleUrls: ['./tabsnav.page.scss'],
})
export class TabsnavPage implements OnInit{
 
  constructor(
    private keyboard: Keyboard
  ) {
    window.addEventListener('keyboardWillShow', () => {
      console.log("Keyboard will Show");
    });
    window.addEventListener('keyboardDidShow', () => {
      console.log("Keyboard is Shown");
    });
    window.addEventListener('keyboardWillHide', () => {
      console.log("Keyboard will Hide");
    });
    window.addEventListener('keyboardDidHide', () => {
      console.log("Keyboard is Hidden");
    });
  }
 
 
  showKeyboard() {
    this.keyboard.isVisible;
  }
  hideKeyboard() {
    this.keyboard.hide();
  }
	ngOnInit() {
	}

}
