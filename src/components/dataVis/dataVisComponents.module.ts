import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { TreeDiagramComponent } from './tree-diagram/tree-diagram';
import { TreeNodeInfoComponent } from './tree-diagram/tree-node-info/tree-node-info';
import { TreeNodeAllocationComponent } from './tree-diagram/tree-node-allocation/tree-node-allocation';
import { TreeTableComponent } from './tree-diagram/tree-table/tree-table';
import { SampleSizeCalculatorComponent } from './sample-size-calculator/sample-size-calculator';
import { GeneralComponentsModule } from '../general/generalComponents.module';

@NgModule({
    declarations: [
        TreeDiagramComponent,
        TreeNodeInfoComponent,
        TreeNodeAllocationComponent,
        TreeTableComponent,
        SampleSizeCalculatorComponent,
    ],
    imports: [
        IonicModule,
        GeneralComponentsModule,
    ],
    exports: [
        TreeDiagramComponent,
        TreeNodeInfoComponent,
        TreeNodeAllocationComponent,
        TreeTableComponent,
        SampleSizeCalculatorComponent,
    ]
})
export class DataVisComponentsModule { }
