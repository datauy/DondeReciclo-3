import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ImageSliderComponent } from './image-slider.component';

describe('ImageSliderComponent', () => {
  let component: ImageSliderComponent;
  let fixture: ComponentFixture<ImageSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageSliderComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
