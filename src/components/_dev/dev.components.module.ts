import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './config';
import { DevEditorToggleComponent } from './editor-toggle';
import { DevEditorResourcesComponent } from './editor-resources';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import {NgxWigModule} from 'ngx-wig';


@NgModule({
    declarations: [
        DevEditorToggleComponent,
        DevEditorResourcesComponent
    ],
    imports: [
        AngularFireModule.initializeApp(firebaseConfig.firebase),
        AngularFirestoreModule,
        IonicModule,
        NgxWigModule 
                
    ],
    exports: [
        DevEditorToggleComponent,
        DevEditorResourcesComponent
    ],
})
export class DevComponentsModule { }
