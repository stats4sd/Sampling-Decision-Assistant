import { Component, Input } from "@angular/core";
import { GlossaryListComponent } from "../glossary-list";
import { IGlossaryTerm } from "../../../../models/models";

@Component({
  selector: "glossary-detail",
  templateUrl: "glossary-detail.html",
  styleUrls: ["glossary-detail.scss"]
})
export class GlossaryDetailComponent extends GlossaryListComponent {
  @Input()
  set term(term: IGlossaryTerm) {
    if (term && term.term) {
      this._term = term;
    }
  }
  _term: any;
}
