import { Component, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
// dev
import { AngularFirestore } from "@angular/fire/firestore";
import { expand } from "../../../providers/animationStates";

@Component({
  selector: "resources-list",
  templateUrl: "resources-list.html",
  animations: [expand]
})
export class ResourcesListComponent {
  // @select(["view", "params", "relevant"])
  // readonly relevant$: Observable<string>;

  @Input()
  set stage(stage: number) {
    this.setResources(this.allResources[stage]);
    this._stage = stage;
  }
  @Input()
  set relevant(relevant: string) {
    this.showRelevant(relevant);
  }

  _stage: number;
  allResources = [];
  questions: any[] = [];
  // relevant: string = "N/A";
  videoPlayerWidth: number = 675;
  videoPlayerHeight: number = 450;

  constructor(private sanitizer: DomSanitizer, private db: AngularFirestore) {
    this.db
      .collection("resources")
      .valueChanges()
      .subscribe(res => {
        this.allResources = res;
        this.setResources(this.allResources[this._stage]);
      });
  }

  ngAfterViewInit() {
    // set video player width
  }

  setResources(stageResources: any) {
    // convert json objecto to array
    if (stageResources) {
      let questions = [];
      Object.keys(stageResources.questions).forEach(k => {
        questions.push(stageResources.questions[k]);
      });
      this.questions = questions;
    }
  }

  viewResource(index: number, showFormat?: string) {
    // select format and toggle expand/contract on question
    let q = this.questions[index];
    if (showFormat) {
      q.showFormat = showFormat;
      q.expanded = true;
    } else {
      if (!q.showFormat) {
        q.showFormat = this.chooseDefaultFormat(q);
      }
      q.expanded = !q.expanded;
    }
    console.log("q", q);
  }
  chooseDefaultFormat(q) {
    let format;
    if (q.audio) {
      q.audioUrl = this.sanitizer.bypassSecurityTrustUrl(
        location.origin + "/assets/resources/" + q.audio
      );
      format = "audio";
    }
    if (q.youtubeID) {
      // set video url to play hosted video (note, will need diff method if on mobile device)
      // q.videoUrl = this.sanitizer.bypassSecurityTrustUrl(location.origin + '/assets/resources/' + q.video)
      format = "video";
    } else {
      format = "text";
    }
    return format;
  }

  // automatically expand relevant questions on click
  showRelevant(relevant: string) {
    if (relevant) {
      console.log("showing relevant", relevant);
      this.questions.forEach((q, i) => {
        if (q.relevant && q.relevant.indexOf(relevant) > -1) {
          this.viewResource(i);
        } else {
          this.questions[i].expanded = false;
        }
      });
    }
  }
}
