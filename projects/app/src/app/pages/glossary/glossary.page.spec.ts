import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GlossaryPage } from './glossary.page';

describe('GlossaryPage', () => {
  let component: GlossaryPage;
  let fixture: ComponentFixture<GlossaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlossaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GlossaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
