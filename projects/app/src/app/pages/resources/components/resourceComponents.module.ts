import { NgModule } from "@angular/core";
// import ionic module if plan to use ionic components
import { IonicModule } from "@ionic/angular";
import { ResourcesListComponent } from "./resources-list/resources-list";
import { ResourceItemComponent } from "./resource-item/resource-item";
import { CommonModule } from "@angular/common";
import { GeneralComponentsModule } from "src/app/components/general/generalComponents.module";
import { NgxYoutubePlayerModule } from "ngx-youtube-player";

@NgModule({
  declarations: [ResourcesListComponent, ResourceItemComponent],
  imports: [
    IonicModule,
    CommonModule,
    GeneralComponentsModule,
    NgxYoutubePlayerModule
  ],
  exports: [ResourcesListComponent, ResourceItemComponent]
})
export class ResourceComponentsModule {}
