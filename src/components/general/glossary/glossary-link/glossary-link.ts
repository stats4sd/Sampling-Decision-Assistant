import { Component, Input } from "@angular/core";
import { CustomRouterProvider } from "../../../../providers/router/router";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { GlossaryProvider } from "../../../../providers/glossary/glossary";
import { IGlossaryTerm } from "../../../../models/models";

@Component({
  selector: "glossary-link",
  templateUrl: "glossary-link.html"
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

  constructor(
    private customRouter: CustomRouterProvider,
    private glossaryPrvdr: GlossaryProvider
  ) {
    // remove glossary term on section change
    this.tabSection$.subscribe(section => {
      if (section && section != "glossary") {
        this.customRouter.removeHashParam("activeGlossaryTerm");
      }
    });
  }
  ngOnInit() {
    if (this.slug) {
      this.term = this.glossaryPrvdr.allGlossary[this.slug];
      if (!this.term) {
        throw new Error(`no glossary entry for ${this.slug}`);
      }
      if (this.customDefinition) {
        this.term.definition = this.customDefinition;
      }
      console.log("glossary term init", this.term);
    }
  }

  tooltipHover(e: MouseEvent) {
    console.log("hover", e.x);
    if (e.x < 250) {
      this.tooltipPos = "right";
    } else {
      this.tooltipPos = "left";
    }
  }

  glossaryClick() {
    console.log("glossary click", this.term);
    // this.customRouter.unlockHash();
    // this.customRouter.updateHashParams({
    //   tabSection: "glossary",
    //   activeGlossaryTerm: this.slug
    // });
  }
}
