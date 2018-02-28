import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Events, ToastController, AlertController } from 'ionic-angular';
import questionMeta from '../questionMeta';
// import * as XLSX from 'xlsx';
import { utils, write, WorkBook, read } from 'xlsx';
import { saveAs } from 'file-saver';
import { FormProvider } from '../form/form'
// import * as dojox from 'dojo'

@Injectable()
export class DataProvider {
  public savedSurveys: any;
  public activeSurvey: any;
  public questionMeta = questionMeta;
  private _dbVersion = 1;
  private isSaving:boolean=false

  constructor(
    public storage: Storage,
    private events: Events,
    public toastCtrl: ToastController,
    private formPrvdr: FormProvider,
    public alertCtrl: AlertController
  ) {
    this.activeSurvey = {
      stagesComplete: [null, false, false, false, false, false, false],
      title:'(unsaved project)'
    }
    this.loadSavedSurveys()
    // save survey whenever value changes, includes throttle to prevent multiple
    this.formPrvdr.formGroup.valueChanges.subscribe(_=>{
      this.backgroundSave()
    })
  }
  backgroundSave(){
    // throttled save of survey, pulling values from master formgroup
    if(!this.isSaving){
      this.isSaving=true
      setTimeout(_=>{
        this.activeSurvey.values=this.formPrvdr.formGroup.value
        this.saveSurvey(this.activeSurvey,true).then(res=>{
          console.log('saved')
          this.isSaving=false
        })
      },500)
    }
    
  }

  createNewSurvey(title: string, backgroundMode?: boolean) {
    this.activeSurvey = {
      title: title,
      created: new Date(),
      values: {},
      stagesComplete: [null, false, false, false, false, false, false]
    }
    this.savedSurveys[title] = this.activeSurvey
    this.saveSurvey(null, backgroundMode);
  }

  deleteSurvey(title) {
    if (this.activeSurvey && this.activeSurvey.title == title) {
      this.activeSurvey = null
    }
    delete this.savedSurveys[title]
    if (!this.savedSurveys) { this.savedSurveys = {} }
    return this.saveToStorage('savedSurveys', this.savedSurveys)
  }

  loadSurvey(survey) {
    this.activeSurvey = survey
    this.formPrvdr.initFormValues(survey.values)
  }

  saveSurvey(survey?, backgroundMode?) {
    // save entire survey to local storage. provide survey param to specify exact (e.g. in import), otherwise will pull from form provider
    return new Promise((resolve, reject) => {
      if (survey) {
        this.savedSurveys[survey.title] = survey
        this.saveToStorage('savedSurveys', this.savedSurveys).then(
          _ => {
            if (!backgroundMode) {
              this.showNotification('Imported Successfully')
            }
            resolve('saved')

          })
      }
      else if (this.activeSurvey.title) {
        let title = this.activeSurvey.title
        this.savedSurveys[title] = this.activeSurvey
        this.activeSurvey.values = this.formPrvdr.formGroup.value
        this.activeSurvey._dbVersion = this._dbVersion
        this.saveToStorage('savedSurveys', this.savedSurveys).then(
          _ => {
            if (!backgroundMode) {
              this.showNotification('Progress Saved')
            }
            resolve('saved')
          }
        )
      }
      else {
        resolve('saved')
      }
    })
  }

  showNotification(message, duration?, position?) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration ? duration : 3000,
      position: position ? position : 'bottom'
    })
    toast.present()
  }
  loadSavedSurveys() {
    this.getFromStorage('savedSurveys').then(
      res => {
        this.savedSurveys = res ? res : {}
        // remove old format
        Object.keys(this.savedSurveys).forEach(k => {
          let survey = res[k]
          if (!survey._dbVersion || survey._dbVersion < this._dbVersion) { delete this.savedSurveys[k] }
        })
        // load testing survey by default if created for faster dev workflow //
        if (this.savedSurveys._testing) { this.loadSurvey(this.savedSurveys._testing) }
        else if (this.savedSurveys['(unsaved project)']) {
          // prompt resume of previous survey if available
          this.promptSurveyResume(this.savedSurveys['(unsaved project)'])
        }
        else {
          // else save new to '(unsaved project)'
          let d = new Date
          this.createNewSurvey('(unsaved project)', true)
        }
      }
    )
  }
  promptSurveyResume(survey) {
    // give option to resume previous survey
    this.alertCtrl.create({
      title: 'Resume project?',
      message: 'An unsaved project was found, do you wish to resume it?',
      buttons: [
        {
          text: 'Discard',
          handler: () => {
            this.createNewSurvey('(unsaved project)', true)
          }
        },
        {
          text: 'Resume',
          handler: () => {
            this.loadSurvey(survey)
          }
        }
      ],
      enableBackdropDismiss: false
    }).present()
  }

  // ***** general storage functions ***** //

  getFromStorage(key) {
    // general method to get key from storage. returns a promise, if data does not exist returns empty json object
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then(
          res => {
            // if (res != null) { this.activeSurvey = res }
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
    const ws_name = this.activeSurvey.title;
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

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'Sampling Decisions - ' + this.activeSurvey.title + '.xlsx');
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
    this.activeSurvey = survey
    // create new project entry, prompting rename where appropriate
    if (this.savedSurveys[survey.title]) {
      this.events.subscribe('project:rename', title => {
        survey.title = title
        this.saveSurvey(survey).then(_ => {
          this.events.unsubscribe('project:rename')
          this.events.publish('import:complete')
        })
      })
      this.events.publish('import:duplicate', survey)
    }
    else {
      this.saveSurvey(survey).then(_ => this.events.publish('import:complete'))
    }
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