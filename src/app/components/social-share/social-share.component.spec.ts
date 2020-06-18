import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SocialShareComponent } from './social-share.component';

describe('SocialShareComponent', () => {
  let component: SocialShareComponent;
  let fixture: ComponentFixture<SocialShareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialShareComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SocialShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
