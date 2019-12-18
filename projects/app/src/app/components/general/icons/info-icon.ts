import { Component } from "@angular/core";

@Component({
  selector: "info-icon",
  template: `
    <div style="display:flex; align-items:center">
      <ion-icon
        style="font-size:24px"
        name="information-circle"
        color="dark"
      ></ion-icon>
      <span style="flex:1; margin-left:5px">
        <ng-content></ng-content>
      </span>
    </div>
  `
})
export class InfoIconComponent {}
