import { NgModule } from '@angular/core';
// import ionic module if plan to use ionic components
import { IonicModule } from 'ionic-angular';
import {ComponentsModule} from '../components.module'
import { Stage1Component } from './1/stage-1';
import { Stage2Component } from './2/stage-2';
import { Stage3Component } from './3/stage-3';
import { Stage4Component } from './4/stage-4';
import { Stage5Component } from './5/stage-5';

// import { DecisionToolMenuComponent } from './decision-tool-menu/decision-tool-menu';
@NgModule({
    declarations: [
        Stage1Component,
        Stage2Component,
        Stage3Component,
        Stage4Component,
        Stage5Component,
    ],
    imports: [
        IonicModule,
        ComponentsModule
    ],
    exports: [
        Stage1Component,
        Stage2Component,
        Stage3Component,
        Stage4Component,
        Stage5Component,
    ]
})
export class StageComponentsModule { }
