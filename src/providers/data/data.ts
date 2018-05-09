import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import {map} from 'rxjs/operators'
import { Events, ToastController, AlertController } from 'ionic-angular';
import questionMeta from '../questionMeta';
// import * as XLSX from 'xlsx';
import { utils, write, WorkBook, read } from 'xlsx';
import { saveAs } from 'file-saver';
import { FormProvider } from '../form/form'
import { ProjectActions } from '../../actions/actions';
import { SavedProjects, Project, AppState } from '../../models/models';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';

// import * as dojox from 'dojo'

@Injectable()
export class DataProvider {
  public questionMeta = questionMeta;
  public _dbVersion = 3;
  // db versions
  // 3 - v0.9.5 April 2018
  private isSaving: boolean = false;
  public savedProjectsJson: any = {}
  public activeProject: Project;
  @select('activeProject') readonly activeProject$: Observable<Project>;


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
    this.activeProject$.subscribe(p => { if (p) { this.activeProject = p } })
    this.loadSavedProjects(true)
    this.projectActions.setMeta({ _dbVersion: this._dbVersion })
  }


  createNewProject(title?) {
    let date: number = Date.now()
    let project: Project = {
      title: title,
      created: date,
      edited: date,
      dbVersion: this._dbVersion,
      values: {},
      stagesComplete: [null, false, false, false, false, false, false]
    }
    this.projectActions.setNewProject(project)
    this.formPrvdr.historicValues={}
    this.formPrvdr.formGroup.reset()
    

  }

  checkProjectTitleUnique(title:string){
    let projectTitles:string[]=[]
    Object.keys(this.savedProjectsJson).forEach(key => {
      if(this.savedProjectsJson[key].title){
        projectTitles.push(this.savedProjectsJson[key].title.toLowerCase())
      }
    });
    return projectTitles.indexOf(title)
  }

  showNotification(message, duration?, position?) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration ? duration : 3000,
      position: position ? position : 'bottom'
    })
    toast.present()
  }
  loadSavedProjects(promptResume?:boolean) {
    let saved: SavedProjects = []
    this.getFromStorage('savedSurveys').then(
      res => {
        if (res) {
          // deprecate old format
          Object.keys(res).forEach(k => {
            let survey = res[k]
            saved.push(res[k])
          })
          this.savedProjectsJson = res
          saved.sort((a, b) => {
            return b.edited - a.edited 
          })
          this.projectActions.listProjects(saved)
          if (saved.length > 0 && promptResume) {
            this.promptProjectResume([...saved][0])
          }
        }
        else {
          this.projectActions.listProjects([])
          this.createNewProject()
        }

      }
    )
  }
  promptProjectResume(project: Project) {
    // don't resume if using outdated db version
    if (project.dbVersion != this._dbVersion) {
      this.createNewProject()
      return
    }

    let title = project.title ? project.title : 'Unsaved Project - ' + new Date(project.created).toLocaleString()
    this.alertCtrl.create({
      title: 'Resume project?',
      message: `
      <div>Do you wish to continue with your last project</div>
      <div class='project-title'>`+ title + `</div>
      `,
      buttons: [
        {
          text: 'No thanks',
          handler: () => {
            this.createNewProject()
          }
        },
        {
          text: 'Yes, resume',
          handler: () => {
            this.loadProject(project)
          }
        }
      ],
      enableBackdropDismiss: false
    }).present()
  }

  loadProject(project: Project) {
    this.projectActions.setActiveProject(project)
    this.formPrvdr.initFormValues(project.values)
  }

  backgroundSave() {
    // throttled save of survey, pulling values from master formgroup
    return new Promise((resolve,reject)=>{
      let activeProject = this.ngRedux.getState().activeProject
    if (activeProject && !this.isSaving) {
      this.isSaving = true
      activeProject.edited = Date.now()
      setTimeout(_ => {
        // this.activeProject.values = this.formPrvdr.formGroup.value
        this.savedProjectsJson[activeProject.created] = activeProject
        this.saveToStorage('savedSurveys', this.savedProjectsJson).then(
          res => { 
            this.isSaving = false; 
            console.log('saved') 
            resolve()
          }
        )
      }, 500)
    }
    })    
  }

  // }

  deleteProject(project:Project) {
    if (this.activeProject && this.activeProject.created == project.created) {
      // prevent active project being deleted?
    }
    else{
      console.log('deleteing project',project.created)
      delete this.savedProjectsJson[project.created]
      this.saveToStorage('savedSurveys', this.savedProjectsJson).then(
        ()=>this.loadSavedProjects()
      )
    }
    console.log('saved projects json',this.savedProjectsJson)
        
  }



  // ***** general storage functions ***** //

  getFromStorage(key) {
    // general method to get key from storage. returns a promise, if data does not exist returns empty json object
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then(
          res => {
            // if (res != null) { this.activeProject = res }
            resolve(res)
          }
        )
    })
  }
  saveToStorage(key, value) {
    // general method to save object to storage (can be any format, will automatically stringify arrays or objects and parse on get)
    return this.storage.set(key, value)
  }

  export() {
    // export as xlsx
    let rows = this.prepareExport()
    const ws_name = this.activeProject.title;
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    const ws: any = utils.json_to_sheet(rows);
    wb.SheetNames.push(ws_name);
    wb.Sheets[ws_name] = ws;
    const wbout = write(wb, { bookType: 'xlsx', bookSST: true, type: 'binary' });

    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i !== s.length; ++i) {
        view[i] = s.charCodeAt(i) & 0xFF;
      };
      return buf;
    }

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Sampling Decisions - ' + this.activeProject.title + '.xlsx');
  }
  import(files) {
    // support processing of drag and drop files using filereader api
    // *** note, currently only supporting readasbinarystring so not entirely compatible. Need to test ***
    // prepare reader
    let reader = new FileReader()
    reader.onload = () => this._processImport(reader)
    reader.onerror = function (err) { console.log('error', err) }
    // process files
    files.forEach(file => {
      file.fileEntry.file(
        info => {
          // get in base64 format
          // reader.readAsDataURL(info)
          reader.readAsBinaryString(info)
          //reader.readAsArrayBuffer(info)
        }
      )
    })
  }
  _processImport(reader) {
    // assumes data read in base64 format. Reads workbook data, runs prepare to convert back into correct format and saves to db
    let data = reader.result
    var workbook = read(data, { type: 'binary' });
    let sheetName = workbook.SheetNames[0]
    let jsonArr = utils.sheet_to_json(workbook.Sheets[sheetName])
    let values = this.prepareImport(jsonArr)
    let survey = {
      title: sheetName,
      values: values,
      created: new Date(),
      imported: true
    }
    // this.activeProject = survey
    // // create new project entry, prompting rename where appropriate
    // if (this.savedSurveys[survey.title]) {
    //   this.events.subscribe('project:rename', title => {
    //     survey.title = title
    //     this.saveSurvey(survey).then(_ => {
    //       this.events.unsubscribe('project:rename')
    //       this.events.publish('import:complete')
    //     })
    //   })
    //   this.events.publish('import:duplicate', survey)
    // }
    // else {
    //   this.saveSurvey(survey).then(_ => this.events.publish('import:complete'))
    // }
  }

  prepareExport() {
    // iterate over json, where array object flatten. Currently bespoke for repeat groups (not generalised)
    let values = this.formPrvdr.formGroup.value
    let json = {}
    for (let key in values) {
      if (values.hasOwnProperty(key)) { json[key] = values[key] }
    }
    let rows = []
    // prepare labels
    let labels = {}
    questionMeta.forEach(q => labels[q.controlName] = q.label)

    Object.keys(json).forEach(key => {
      let val = json[key]
      // replace empty strings with 'Not answered'
      if (val == "") { json[key] = "Not answered" }
      // convert nested repeat group into seperate entry
      if (typeof val == "object") {
        val.forEach((el, index) => {
          Object.keys(el).forEach(k => {
            let v = el[k]
            let entry = k + '_' + index
            json[entry] = v
          })
        });
        json[key] = "repeat-group"
      }
    })

    // second pass, this time creating rows for excel
    Object.keys(json).forEach(key => {
      let val = json[key]
      let temp = {
        id: key,
        question: labels[key.split('_')[0]],
        response: val
      }
      rows.push(temp)
    })

    return rows
  }
  prepareImport(arr) {
    // inverse of above for importing data back in
    let processed = {}
    arr.forEach((el, i) => {
      let id = el.id
      let val = el.response
      if (val == "Not answered") { val = "" }
      // rebuild repeat group holder
      if (val == "repeat-group") {
        processed[id] = []
      }
      // populate repeat group entries
      else if (id.indexOf('_') > -1) {
        // form q5.2.6_0 needs to be in 5.2 array 0 under q5.2.6
        //                              q       qindex     qid
        let qid = id.split('_')[0]
        let arr = qid.split('.')
        arr.splice(arr.length - 1, 1)
        let q = arr.join('.')
        let qindex = id.split('_')[1]
        if (!processed[q]) { processed[q] = [] }
        if (!processed[q][qindex]) { processed[q][qindex] = {} }
        processed[q][qindex][qid] = val

      }
      // add all other data
      else { processed[id] = val }
    })
    return processed

  }


}




/*Demos

get(key):

    this.dataPrvdr.get('key')
      .then(
      data => console.log('data retrieved from storage', data),
      err => console.log('error retrieving from storage', err)
      )
    
    

 */



// _generatePdf() {
//   // somewhat tricky method to try and output contents to a pdf doc
//   // needs to first create clone of element off screen for proper rendering

//   var pdf = new jsPDF
//   var offScreen = document.querySelector('.pdf-output');
//   // Clone off-screen element
//   var clone = hiddenClone(offScreen);
//   // Use clone with htm2canvas and delete clone
//   html2canvas(clone, {}).then(canvas => {
//     // document.getElementById("outputImage").appendChild(canvas)
//     document.body.removeChild(clone);
//     // generate pdf from canvas image
//     var doc = new jsPDF("p", "mm", "a4");
//     let imgData = canvas.toDataURL("image/PNG");
//     doc.addImage(imgData, 'PNG', 20, 20);
//     let pdfOutput = doc.output();
//     // using ArrayBuffer will allow you to put image inside PDF
//     let buffer = new ArrayBuffer(pdfOutput.length);
//     let array = new Uint8Array(buffer);
//     for (var i = 0; i < pdfOutput.length; i++) {
//       array[i] = pdfOutput.charCodeAt(i);
//     }
//     doc.save('output.pdf')
//   })
// }
// }

// function hiddenClone(element) {
// // Create clone of element
// var clone = element.cloneNode(true);
// // Position element relatively within the 
// // body but still out of the viewport
// var style = clone.style;
// style.position = 'relative';
// style.top = window.innerHeight + 'px';
// style.left = 0;
// // Append clone to body and return the clone
// document.body.appendChild(clone);
// return clone;
// }


//This is where the PDF file will stored , you can change it as you like
// for more information please visit https://ionicframework.com/docs/native/file/
// const directory = this.file.externalApplicationStorageDirectory ;

//Name of pdf
//const fileName = "example.pdf";

//Writing File to Device
//   this.file.writeFile(directory,fileName,buffer)
//   .then((success)=> console.log("File created Succesfully" + JSON.stringify(success)))
//   .catch((error)=> console.log("Cannot Create File " +JSON.stringify(error)));

// });