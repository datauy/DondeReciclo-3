import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TabsnavPage } from './tabsnav.page';

describe('TabsnavPage', () => {
  let component: TabsnavPage;
  let fixture: ComponentFixture<TabsnavPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabsnavPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TabsnavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
