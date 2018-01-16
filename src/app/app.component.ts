import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{ title: string, component: any, disabled?: boolean }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public events:Events) {
    this.initializeApp();


    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: 'HomePage' },
      // { title: 'Technical terms explained', component: 'TechnicalTermsPage',disabled:true },
      { title: 'Sample size trade-off tool', component: 'SampleSizeTradeoffPage', disabled: true },
      // { title: 'Sample design assessment tool', component: 'SampleDesignAssessmentPage',disabled:true },
      { title: 'How to use this guide', component: 'HowTo', disabled: true },
      { title: 'More information and support', component: 'MoreInfo', disabled: true },
      { title: 'Glossary', component: 'GlossaryPage', disabled: false },
      { title: 'About', component: 'AboutPage', disabled: true },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // monitor window hash changes and publish corresponding event
      window.addEventListener('hashchange', ()=> {
        console.log("Hash Changed",location.hash);
        this.events.publish('hash:changed',location.hash)
      })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
