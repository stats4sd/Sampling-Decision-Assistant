import { Component } from "@angular/core";
import { IGlossaryTerm } from "src/app/models/models";
import { ActivatedRoute } from "@angular/router";
import { ALL_GLOSSARY } from "src/app/data";

@Component({
  selector: "app-glossary",
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Glossary</ion-title>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="home"> </ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <page-content>
      <glossary-list
        displayMode="page"
        [activeTerm]="activeTerm"
      ></glossary-list>
    </page-content>
  `
})
export class GlossaryPage {
  activeTerm: IGlossaryTerm;
  constructor(route: ActivatedRoute) {
    const params = route.snapshot.params;
    if (params && params.slug) {
      this.activeTerm = ALL_GLOSSARY[params.slug];
    }
  }
}
