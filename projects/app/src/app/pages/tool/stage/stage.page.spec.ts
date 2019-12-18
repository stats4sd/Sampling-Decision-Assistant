import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StagePage } from './stage.page';

describe('StagePage', () => {
  let component: StagePage;
  let fixture: ComponentFixture<StagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
