import { Component } from "@angular/core";
import { APP_VERSION } from "src/environments/version";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  sections: any = [];
  altSections: any = [];
  version = APP_VERSION;
  imageSrc = "assets/img/feature-image-1.jpg";

  constructor(private router: Router) {
    this.sections = [
      {
        name: "Use the Tool",
        page: "tool",
        icon: "arrow-round-forward"
      },
      {
        name: "Tutorial and Examples",
        page: "tutorial"
      }
    ];

    this.altSections = [
      { name: "Glossary of technical terms", page: "glossary" }
    ];
  }

  goToSection(section) {
    this.router.navigate(["/" + section.page]);
  }

  showChangelog() {
    this.router.navigate(["/changelog"]);
  }
}
