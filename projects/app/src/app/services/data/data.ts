import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
// note - import mini to save on bundle size
import * as XLSX from "xlsx/dist/xlsx.mini.min";
import { saveAs } from "file-saver";
import { FormProvider } from "../form/form";
import { ProjectActions } from "../../actions/actions";
import {
  SavedProjects,
  Project,
  AppState,
  IQuestionMeta
} from "../../models/models";
import { select, NgRedux } from "@angular-redux/store";
import { Observable } from "rxjs";
import { Events, ToastController, AlertController } from "@ionic/angular";
import { NgxFileDropEntry, FileSystemFileEntry } from "ngx-file-drop";
import { ALL_QUESTIONS } from "src/app/data";

@Injectable({
  providedIn: "root"
})
export class DataProvider {
  questionMeta: IQuestionMeta[] = ALL_QUESTIONS;

  // db versions
  // 3 - v0.9.5 April 2018
  savedProjectsJson: any = {};
  activeProject: Project;
  public dbVersion = 3;

  @select("activeProject")
  readonly activeProject$: Observable<Project>;
  private isSaving: boolean = false;

  constructor(
    public storage: Storage,
    private events: Events,
    public toastCtrl: ToastController,
    private formPrvdr: FormProvider,
    public alertCtrl: AlertController,
    private projectActions: ProjectActions,
    private ngRedux: NgRedux<AppState>
  ) {
    // bind local activeProject to update from redux, save survey whenever value changese
    this.activeProject$.subscribe(p => {
      if (p) {
        this.activeProject = p;
      }
    });
    this.loadSavedProjects(true);
    this.projectActions.setMeta({ dbVersion: this.dbVersion });
  }

  createNewProject(title?: string) {
    const date: number = Date.now();
    const project: Project = {
      title,
      created: date,
      edited: date,
      dbVersion: this.dbVersion,
      values: {},
      stagesComplete: [null, false, false, false, false, false, false]
    };
    this.projectActions.setNewProject(project);
    this.formPrvdr.historicValues = {};
    this.formPrvdr.formGroup.reset();
  }
  // create copy of new project with different title, i.e. 'save as'
  saveProjectAs(newTitle) {
    if (newTitle != this.activeProject.title) {
      const project: Project = { ...this.activeProject };
      const date: number = Date.now();
      project.title = newTitle;
      project.created = date;
      project.edited = date;
      this.projectActions.setNewProject(project);
      this.backgroundSave();
    }
  }

  checkProjectTitleUnique(title: string) {
    const projectTitles: string[] = [];
    Object.keys(this.savedProjectsJson).forEach(key => {
      if (this.savedProjectsJson[key].title) {
        projectTitles.push(this.savedProjectsJson[key].title.toLowerCase());
      }
    });
    return projectTitles.indexOf(title);
  }

  async showNotification(message, duration?, position?) {
    const toast = await this.toastCtrl.create({
      message,
      duration: duration ? duration : 3000,
      position: position ? position : "bottom"
    });
    await toast.present();
  }
  loadSavedProjects(promptResume?: boolean) {
    const saved: SavedProjects = [];
    this.getFromStorage("savedSurveys").then(res => {
      if (res) {
        // deprecate old format
        Object.keys(res).forEach(k => {
          saved.push(res[k]);
        });
        this.savedProjectsJson = res;
        saved.sort((a, b) => {
          return b.edited - a.edited;
        });
        this.projectActions.listProjects(saved);
        if (saved.length > 0 && promptResume) {
          this.promptProjectResume([...saved][0]);
        }
      } else {
        this.projectActions.listProjects([]);
        this.createNewProject();
      }
    });
  }
  async promptProjectResume(project: Project) {
    // don't resume if using outdated db version
    if (project.dbVersion != this.dbVersion) {
      this.createNewProject();
      return;
    }

    const title = project.title
      ? project.title
      : "Unsaved Project - " + new Date(project.created).toLocaleString();
    const alert = await this.alertCtrl.create({
      header: "Resume project?",
      message:
        `
      <div>Do you wish to continue with your last project</div>
      <div class='project-title'>` +
        title +
        `</div>
      `,
      buttons: [
        {
          text: "No thanks",
          handler: () => {
            this.createNewProject();
          }
        },
        {
          text: "Yes, resume",
          handler: () => {
            this.loadProject(project);
          }
        }
      ],
      backdropDismiss: false
    });
    await alert.present();
  }

  loadProject(project: Project) {
    this.formPrvdr.historicValues = {};
    this.projectActions.setActiveProject(project);
    this.formPrvdr.initFormValues(project.values);
  }

  backgroundSave() {
    // throttled save of survey, pulling values from master formgroup
    return new Promise((resolve, reject) => {
      const activeProject = this.ngRedux.getState().activeProject;
      if (activeProject && !this.isSaving) {
        this.isSaving = true;
        activeProject.edited = Date.now();
        setTimeout(_ => {
          this.savedProjectsJson[activeProject.created] = activeProject;
          this.saveToStorage("savedSurveys", this.savedProjectsJson).then(
            res => {
              this.isSaving = false;
              console.log("project saved");
              resolve();
            }
          );
        }, 500);
      }
    });
  }

  // }

  deleteProject(project: Project) {
    if (this.activeProject && this.activeProject.created == project.created) {
      // prevent active project being deleted?
    } else {
      console.log("deleteing project", project.created);
      delete this.savedProjectsJson[project.created];
      this.saveToStorage("savedSurveys", this.savedProjectsJson).then(() =>
        this.loadSavedProjects()
      );
    }
    console.log("saved projects json", this.savedProjectsJson);
  }

  // ***** general storage functions ***** //

  getFromStorage(key) {
    // general method to get key from storage. returns a promise, if data does not exist returns empty json object
    return new Promise((resolve, reject) => {
      this.storage.get(key).then(res => {
        // if (res != null) { this.activeProject = res }
        resolve(res);
      });
    });
  }
  saveToStorage(key, value) {
    // general method to save object to storage (can be any format, will automatically stringify arrays or objects and parse on get)
    return this.storage.set(key, value);
  }

  exportXLSX(sheets) {
    console.log("exporting xlsx", sheets);
    const wb: XLSX.WorkBook = { SheetNames: [], Sheets: {} };
    sheets.forEach(sheet => {
      const ws_name = sheet.title;
      const ws: any = XLSX.utils.json_to_sheet(sheet.rows);
      wb.SheetNames.unshift(ws_name);
      wb.Sheets[ws_name] = ws;
    });
    const wbout = XLSX.write(wb, {
      bookType: "xlsx",
      bookSST: true,
      type: "binary"
    });
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xff;
      }
      return buf;
    }
    saveAs(
      new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
      "Sampling Decisions - " + this.activeProject.title + ".xlsx"
    );
  }

  prepareImport(arr) {
    // inverse of above for importing data back in
    let processed = {};
    arr.forEach((el, i) => {
      let id = el.id;
      let val = el.response;
      if (val == "Not answered") {
        val = "";
      }
      // rebuild repeat group holder
      if (val == "repeat-group") {
        processed[id] = [];
      }
      // populate repeat group entries
      else if (id.indexOf("_") > -1) {
        // form q5.2.6_0 needs to be in 5.2 array 0 under q5.2.6
        //                              q       qindex     qid
        let qid = id.split("_")[0];
        let arr = qid.split(".");
        arr.splice(arr.length - 1, 1);
        let q = arr.join(".");
        let qindex = id.split("_")[1];
        if (!processed[q]) {
          processed[q] = [];
        }
        if (!processed[q][qindex]) {
          processed[q][qindex] = {};
        }
        processed[q][qindex][qid] = val;
      }
      // add all other data
      else {
        processed[id] = val;
      }
    });
    return processed;
  }

  import(entries: NgxFileDropEntry[] = []) {
    console.log("import files", entries);
    // support processing of drag and drop files using filereader api
    // *** note, currently only supporting readasbinarystring so not entirely compatible. Need to test ***
    // prepare reader
    let reader = new FileReader();
    reader.onload = () => this._processImport(reader);
    reader.onerror = function(err) {
      console.log("error", err);
    };
    // process files
    entries.forEach(entry => {
      if (entry.fileEntry.isFile) {
        const fileEntry = entry.fileEntry as FileSystemFileEntry;
        fileEntry.file(info => {
          // get in base64 format
          reader.readAsBinaryString(info);
        });
      }
    });
  }

  // read in project json file, check for name conflicts, save project, set active
  _processImport(reader) {
    const project: Project = JSON.parse(reader.result);
    const saved: Project[] = this.ngRedux.getState().savedProjects;
    let projectTitles = {};
    if (saved && saved.length > 0) {
      saved.forEach(p => (projectTitles[p.title] = true));
    }
    if (projectTitles.hasOwnProperty(project.title)) {
      this.events.publish("import:duplicate", project);
    } else {
      this.loadProject(project);
      this.events.publish("import:complete");
      this.backgroundSave();
    }
  }
}
