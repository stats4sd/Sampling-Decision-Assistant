import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { DevEditorToggleComponent } from './editor-toggle';
import { DevEditorResourcesComponent } from './editor-resources';
import { DevEditorGlossaryComponent } from './editor-glossary';

import {NgxWigModule} from 'ngx-wig';


@NgModule({
    declarations: [
        DevEditorToggleComponent,
        DevEditorResourcesComponent,
        DevEditorGlossaryComponent
    ],
    imports: [
        IonicModule,
        NgxWigModule 
                
    ],
    exports: [
        DevEditorToggleComponent,
        DevEditorResourcesComponent,
        DevEditorGlossaryComponent
    ],
})
export class DevComponentsModule { }
