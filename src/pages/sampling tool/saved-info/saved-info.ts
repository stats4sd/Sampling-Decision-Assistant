import { AfterViewInit, Component } from "@angular/core";
import {
  IonicPage,
  ViewController,
  NavParams,
  Events,
  AlertController
} from "ionic-angular";
import { DataProvider } from "../../../providers/data/data";
import { UploadEvent } from "ngx-file-drop";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs";
import { Project } from "../../../models/models";

@IonicPage()
@Component({
  selector: "page-saved-info",
  templateUrl: "saved-info.html"
})
export class SavedInfoPage implements AfterViewInit {
  @select("savedProjects")
  savedProjects$: Observable<Project[]>;
  @select("activeProject")
  activeProject$: Observable<Project>;
  savedProjects: Project[] = [];
  activeProject: Project;
  saveName: string;
  view: string;
  savedSurveys: any;
  errorMsg: string;
  _dbVersion: number;

  constructor(
    public viewCtrl: ViewController,
    public navParams: NavParams,
    private dataPrvdr: DataProvider,
    public events: Events,
    public alertCtrl: AlertController
  ) {
    this.view = this.navParams.data.view;
    this._dbVersion = this.dataPrvdr._dbVersion;
    this.savedProjects$.subscribe(projects => {
      if (projects) {
        this.savedProjects = projects.filter(
          p => p.dbVersion == this._dbVersion
        );
      }
    });
    this.activeProject$.subscribe(p => (this.activeProject = p));
  }
  // when saved projects loaded want to refresh projects list from db
  ngAfterViewInit() {
    this.dataPrvdr.loadSavedProjects(false);
  }

  createNew() {
    if (this.dataPrvdr.checkProjectTitleUnique(this.saveName) == -1) {
      this.dataPrvdr.createNewProject(this.saveName);
      this.viewCtrl.dismiss({ title: this.saveName });
    } else {
      this.errorMsg = "A project with that name already exists";
    }
  }

  setView(view) {
    this.view = view;
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  loadProject(project: Project) {
    console.log("loading project", project);
    this.dataPrvdr.loadProject(project);
    this.viewCtrl.dismiss();
  }
  deleteProject(project: Project) {
    this.dataPrvdr.deleteProject(project);
  }

  // file drop
  dropped(e: UploadEvent) {
    // handle file drop
    let files = e.files;
    this.events.subscribe("import:duplicate", project => {
      console.log("duplicate file", project);
      this.promptRename(project);
    });
    this.events.subscribe("import:complete", _ => {
      this.dismiss();
    });
    this.dataPrvdr.import(files);
  }

  fileOver(e) {}
  fileLeave(e) {}

  promptRename(project) {
    let prompt = this.alertCtrl.create({
      title: "Notification",
      message: "A project with this name already exists. Please rename.",
      enableBackdropDismiss: false,
      inputs: [
        {
          name: "title",
          placeholder: "title",
          value: project.title
        }
      ],
      buttons: [
        {
          text: "Save",
          handler: data => {
            prompt.dismiss({
              project: project,
              newTitle: data.title
            });
            // return false to not manually dismiss
            return false;
          }
        }
      ]
    });
    prompt.onDidDismiss(data => {
      if (data.newTitle != data.project.title) {
        project.title = data.newTitle;
        console.log("project", project);
        this.dataPrvdr.loadProject(data.project);
        this.dataPrvdr.backgroundSave();
        this.dismiss();
      } else {
        this.errorMsg = "A project with that name already exists";
        this.events.unsubscribe("import:duplicate");
        this.events.unsubscribe("import:complete");
      }
    });
    prompt.present();
  }
}
