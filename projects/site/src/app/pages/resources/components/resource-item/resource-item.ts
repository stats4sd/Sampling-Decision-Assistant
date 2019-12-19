import { Component, Input } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { expand } from "src/app/services/animationStates";
import { IResourceQuestion } from "../../../../models/models";

@Component({
  selector: "resource-item",
  templateUrl: "resource-item.html",
  styleUrls: ["resource-item.scss"],
  animations: [expand]
})
export class ResourceItemComponent {
  @Input()
  question: IResourceQuestion;
  @Input()
  relevant: boolean;
  videoReady: boolean;
  videoPlayerWidth: number;
  videoPlayerHeight: number;

  constructor(private sanitizer: DomSanitizer) {
    this.videoPlayerWidth = Math.min(window.innerWidth - 70, 675);
    this.videoPlayerHeight = Math.round((this.videoPlayerWidth / 16) * 9);
  }

  ngAfterContentInit() {
    // use timeout as error occuring locating div
    setTimeout(() => {
      this.videoReady = true;
    }, 200);
    // expand question if has been marked as relevant
    if (this.relevant) {
      this.viewResource();
    }
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

  viewResource(showFormat?: string) {
    // select format and toggle expand/contract on question
    if (showFormat) {
      this.question._showFormat = showFormat;
      this.question._expanded = true;
    } else {
      if (!this.question._showFormat) {
        this.question._showFormat = this.chooseDefaultFormat(this.question);
      }
      this.question._expanded = !this.question._expanded;
    }
  }
}
