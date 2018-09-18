import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { ProjectActions } from "../actions/actions";
import { GlossaryProvider } from "../providers/glossary/glossary";
import { ResourcesProvider } from "../providers/resources/resources";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav)
  nav: Nav;
  rootPage: any = "HomePage";
  hash: string;
  pages: Array<{ title: string; component: any; disabled?: boolean }>;

  constructor(
    public platform: Platform,
    private projectActions: ProjectActions,
    private glossaryPrvdr: GlossaryProvider,
    private resourcesPrvdr: ResourcesProvider
  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: "Home", component: "HomePage" },
      // { title: 'Technical terms explained', component: 'TechnicalTermsPage',disabled:true },
      {
        title: "Sample size trade-off tool",
        component: "SampleSizeTradeoffPage",
        disabled: true
      },
      // { title: 'Sample design assessment tool', component: 'SampleDesignAssessmentPage',disabled:true },
      { title: "How to use this guide", component: "HowTo", disabled: true },
      {
        title: "More information and support",
        component: "MoreInfo",
        disabled: true
      },
      { title: "Glossary", component: "GlossaryPage", disabled: false },
      { title: "About", component: "AboutPage", disabled: true }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // handle cordova functions
      this.projectActions.setMeta({ _platforms: this.platform.platforms() });
      if (this.platform.is("cordova")) {
        // this.statusBar.styleDefault();
        // this.splashScreen.hide();
      }
      // initialise glossary and resources
      this.glossaryPrvdr.init();
      this.resourcesPrvdr.init();
    });
  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   this.nav.setRoot(page.component);
  // }
}
