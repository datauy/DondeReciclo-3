import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NovedadesDetailPage } from './novedades-detail.page';

describe('NovedadesDetailPage', () => {
  let component: NovedadesDetailPage;
  let fixture: ComponentFixture<NovedadesDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovedadesDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NovedadesDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
