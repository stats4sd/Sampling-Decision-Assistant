import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FrameBuilderPage } from './frame-builder.page';

describe('FrameBuilderPage', () => {
  let component: FrameBuilderPage;
  let fixture: ComponentFixture<FrameBuilderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrameBuilderPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FrameBuilderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
