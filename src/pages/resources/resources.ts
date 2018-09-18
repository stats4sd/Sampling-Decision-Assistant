import { Component } from "@angular/core";
import { IonicPage, NavParams } from "ionic-angular";
import { ResourcesProvider } from "../../providers/resources/resources";

@IonicPage()
@Component({
  selector: "page-resources",
  templateUrl: "resources.html"
})
export class ResourcesPage {
  constructor(
    public navParams: NavParams,
    private resourcesPrvdr: ResourcesProvider
  ) {
    console.log("resource params", navParams.data);
  }

  ngOnInit() {
    // get stage resources
  }
}
