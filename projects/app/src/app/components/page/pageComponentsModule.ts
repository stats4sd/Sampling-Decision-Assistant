import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageContentComponent } from "./page-content/page-content";

/*************************************************************************
 * Page components handle some page layout, such as content height fixing
 * and custom scrollbar
 *************************************************************************/

@NgModule({
  declarations: [PageContentComponent],
  imports: [CommonModule],
  exports: [PageContentComponent]
})
export class PageComponentsModule {}
