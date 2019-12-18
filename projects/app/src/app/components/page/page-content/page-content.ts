import { Component } from "@angular/core";

/*********************************************************************
 *  Custom component to render content in full-page scrollable area
 *  (picks up scrollbar style from theme scrollbar.scss)
 *  Replaces ion-content otherwise used
 ********************************************************************/
@Component({
  selector: "page-content",
  styleUrls: [],
  template: `
    <div
      style="
      overflow:auto; 
      padding:16px; 
      height: calc(100vh - 56px); 
      background:var(--page-background);"
    >
      <ng-content></ng-content>
    </div>
  `
})
export class PageContentComponent {}
