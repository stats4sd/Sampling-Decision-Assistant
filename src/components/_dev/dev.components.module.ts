import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DevEditorToggleComponent } from './editor-toggle';
import { DevEditorResourcesComponent } from './editor-resources';

import {NgxWigModule} from 'ngx-wig';


@NgModule({
    declarations: [
        DevEditorToggleComponent,
        DevEditorResourcesComponent
    ],
    imports: [
        IonicModule,
        NgxWigModule 
                
    ],
    exports: [
        DevEditorToggleComponent,
        DevEditorResourcesComponent
    ],
})
export class DevComponentsModule { }
