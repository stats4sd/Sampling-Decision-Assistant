import { Component, Input } from "@angular/core";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { IGlossaryTerm } from "../../../../models/models";
import { ALL_GLOSSARY } from "src/app/data";
import { Router } from "@angular/router";

@Component({
  selector: "glossary-link",
  templateUrl: "glossary-link.html",
  styleUrls: ["glossary-link.scss"]
})
export class GlossaryLinkComponent {
  term: IGlossaryTerm;
  tooltipPos: "left" | "right" = "right";
  @Input("customDefinition")
  customDefinition: string;
  @Input("slug")
  slug: string;
  @select(["view", "params", "tabSection"])
  tabSection$: Observable<string>;

  constructor(private router: Router) {}
  // on init load glossary from provider (wait if live version and not sync'd)
  // then set terms
  ngOnInit() {
    if (this.slug) {
      this.term = ALL_GLOSSARY[this.slug];
      if (!this.term) {
        throw new Error(`no glossary entry for ${this.slug}`);
      }
      if (this.customDefinition) {
        this.term.definition = this.customDefinition;
      }
    }
  }

  // on hover determine whether to show to left or right
  tooltipHover(e: MouseEvent) {
    if (e.x < window.innerWidth / 2) {
      this.tooltipPos = "right";
    } else {
      this.tooltipPos = "left";
    }
  }

  goToGlossary(term: IGlossaryTerm) {
    this.router.navigate(["glossary", term.slug]);
  }
}
