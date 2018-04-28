import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TreeDiagramComponent } from './tree-diagram/tree-diagram';
import { TreeNodeInfoComponent } from './tree-diagram/tree-node-info/tree-node-info';
import { TreeTableComponent } from './tree-diagram/tree-table/tree-table';



@NgModule({
    declarations: [
        TreeDiagramComponent,
        TreeNodeInfoComponent,
        TreeTableComponent
    ],
    imports: [
        IonicModule,

    ],
    exports: [
        TreeDiagramComponent,
        TreeNodeInfoComponent,
        TreeTableComponent
    ]
})
export class DataVisComponentsModule { }
