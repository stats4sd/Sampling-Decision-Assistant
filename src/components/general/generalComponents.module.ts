import { NgModule } from '@angular/core';
// import ionic module if plan to use ionic components
import { IonicModule } from 'ionic-angular';

import { IntroductionComponent } from './introduction/introduction';
import { GlossaryLinkComponent } from './glossary/glossary-link/glossary-link';
import { GlossaryComponent } from './glossary/glossary';
import { GlossaryDetailComponent } from './glossary/glossary-detail/glossary-detail';
import { NoteComponent } from './note/note';
import { ResourcesComponent } from './resources/resources';
import { HelpIconComponent} from './help-icon/help-icon'
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { ProjectTitleComponent } from './project-title';



// import { DecisionToolMenuComponent } from './decision-tool-menu/decision-tool-menu';
@NgModule({
    declarations: [
        IntroductionComponent,
        GlossaryLinkComponent,
        GlossaryComponent,
        GlossaryDetailComponent,
        NoteComponent,
        ResourcesComponent,
        HelpIconComponent,
        ProjectTitleComponent
    ],
    imports: [
        IonicModule,
        YoutubePlayerModule
    ],
    exports: [
        IntroductionComponent,
        GlossaryLinkComponent,
        GlossaryComponent,
        GlossaryDetailComponent,
        NoteComponent,
        ResourcesComponent,
        HelpIconComponent,
        ProjectTitleComponent
    ]
})
export class GeneralComponentsModule { }
