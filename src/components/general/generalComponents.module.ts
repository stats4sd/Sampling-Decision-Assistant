import { NgModule } from '@angular/core';
// import ionic module if plan to use ionic components
import { IonicModule } from 'ionic-angular';

import { IntroductionComponent } from './introduction/introduction';
import { GlossaryLinkComponent } from './glossary/glossary-link/glossary-link';
import { GlossaryComponent } from './glossary/glossary';
import { GlossaryDetailComponent } from './glossary/glossary-detail/glossary-detail';
import { NoteComponent } from './note/note';
import { TreeDiagramComponent } from './tree-diagram/tree-diagram';
import { ResourcesComponent } from './resources/resources';
import { HelpIconComponent} from './help-icon/help-icon'

// additional video player component used by resource (could split)
// import {VgCoreModule} from 'videogular2/core';
// import {VgControlsModule} from 'videogular2/controls';
// import {VgOverlayPlayModule} from 'videogular2/overlay-play';
// import {VgBufferingModule} from 'videogular2/buffering';
// youtube video player
import { YoutubePlayerModule } from 'ngx-youtube-player';

// import { DecisionToolMenuComponent } from './decision-tool-menu/decision-tool-menu';
@NgModule({
    declarations: [
        IntroductionComponent,
        GlossaryLinkComponent,
        GlossaryComponent,
        GlossaryDetailComponent,
        NoteComponent,
        TreeDiagramComponent,
        ResourcesComponent,
        HelpIconComponent
    ],
    imports: [
        IonicModule,
        // additional video player component
        // VgCoreModule,
        // VgControlsModule,
        // VgOverlayPlayModule,
        // VgBufferingModule,
        YoutubePlayerModule
    ],
    exports: [
        IntroductionComponent,
        GlossaryLinkComponent,
        GlossaryComponent,
        GlossaryDetailComponent,
        NoteComponent,
        TreeDiagramComponent,
        ResourcesComponent,
        HelpIconComponent
    ]
})
export class GeneralComponentsModule { }
