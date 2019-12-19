// note component displays icon and any text between opening and closing tags
// icons given by [type] name lookup from ionicons, or specific mapping from [icons] object below

import { Component } from "@angular/core";
import { Input } from "@angular/core";
@Component({
  selector: "note",
  templateUrl: "note.html",
  styleUrls: ["note.scss"]
})
export class NoteComponent {
  @Input("text")
  text: string;
  @Input()
  set type(type: string) {
    this._type = type;
    if (this.icons[type]) {
      this.icon = this.icons[type];
    } else {
      this.icon = this.type;
    }
  }
  icon: string;
  _type: string = "";
  icons: any = {
    warning: "warning",
    dev: "construct",
    info: "information-circle",
    tip: "bulb",
    clearTip: "bulb",
    error: "alert",
    success: "checkmark-circle-outline"
  };

  constructor() {}
}
