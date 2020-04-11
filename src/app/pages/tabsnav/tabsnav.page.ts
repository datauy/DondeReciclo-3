import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-tabsnav',
  templateUrl: './tabsnav.page.html',
  styleUrls: ['./tabsnav.page.scss'],
})
export class TabsnavPage implements OnInit{

  // @ViewChild('tab', {read: ElementRef}) 
  // tab: ElementRef;
	// tabEl : ElementRef;
	
	// constructor(
	// 	private keyboard: Keyboard
	// ) { }


 
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
    // this.keyboard.show();
    // console.log(this.keyboard.isVisible)
    
		// this.keyboard.onKeyboardWillShow().subscribe(() => {
    //   console.log('keyboard will show');
		// 	this.renderer.addClass(this.tab.nativeElement, 'hide');
		// });
		// this.keyboard.onKeyboardWillHide().subscribe(() => {
    //   console.log('keyboard will hide');
		// 	this.renderer.removeClass(this.tab.nativeElement, 'hide');
		// });
	}

	// ngAfterViewInit() {
	// 	this.tabEl = this.tab.nativeElement;
	// }
  // // MyTabs.ts
  // showListener() {
  //   console.log('keyboard visible');
  //   document.body.classList.add('keyboard-is-open');
  // }
  // hideListener() {
  //   console.log('keyboard hides');
  //   document.body.classList.remove('keyboard-is-open');
  // }


  // ionViewDidEnter() {
  //   window.addEventListener('keyboardWillShow', this.showListener);
  //   window.addEventListener('keyboardDidHide', this.hideListener);
  // }

  // ionViewWillLeave() {
  //   window.removeEventListener('keyboardWillShow', this.showListener);
  //   window.removeEventListener('keyboardDidHide', this.hideListener);
  // }

}
