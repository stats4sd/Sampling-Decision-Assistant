import { Component, Input } from "@angular/core";
import { CustomRouterProvider } from "../../../../providers/router/router";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { GlossaryProvider } from "../../../../providers/glossary/glossary";
import { IGlossaryTerm } from "../../../../models/models";
import { NavController } from "ionic-angular";

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
    private glossaryPrvdr: GlossaryProvider,
    public navCtrl: NavController
  ) {
    // remove glossary term on section change
    this.tabSection$.subscribe(section => {
      if (section && section != "glossary") {
        this.customRouter.removeHashParam("activeGlossaryTerm");
      }
    });
  }
  // on init load glossary from provider (wait if live version and not sync'd)
  // then set terms
  ngOnInit() {
    if (this.glossaryPrvdr.initComplete) {
      if (this.slug) {
        this.term = this.glossaryPrvdr.allGlossary[this.slug];
        if (!this.term) {
          throw new Error(`no glossary entry for ${this.slug}`);
        }
        if (this.customDefinition) {
          this.term.definition = this.customDefinition;
        }
      }
    } else {
      // as loading from firestore and not binding to value changes simply use timeout to ensure
      // glossary fully loaded (only should be a factor when directly navigating to page)
      setTimeout(() => {
        this.ngOnInit();
      }, 500);
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

  goToGlossary() {
    console.log("going to glossary", this.term);
    this.navCtrl.push("GlossaryPage");
  }
}
