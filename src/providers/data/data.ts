import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Events, ToastController } from 'ionic-angular';
import questionMeta from '../questionMeta';
// import * as XLSX from 'xlsx';
import { utils, write, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';
import { FormProvider } from '../form/form'
// import * as dojox from 'dojo'

@Injectable()
export class DataProvider {
  public savedSurveys: any;
  public activeSurvey: any;
  public questionMeta = questionMeta;
  private _dbVersion=1;

  constructor(public storage: Storage, private events: Events, public toastCtrl: ToastController, private formPrvdr: FormProvider) {
    this.events.subscribe('save', _ => this.saveSurvey())
    this.loadSavedSurveys()
  }

  createNewSurvey(title) {
    this.activeSurvey = {
      title: title,
      created: new Date(),
      responses: {}
    }
    console.log('new survey created', this.activeSurvey)
    this.savedSurveys[title] = this.activeSurvey
    this.saveSurvey();
  }

  deleteSurvey(title) {
    console.log('deleting', title, this.savedSurveys)
    if (this.activeSurvey.title == title) {
      this.activeSurvey = null
    }
    delete this.savedSurveys[title]
    if (!this.savedSurveys) { this.savedSurveys = {} }
    console.log('saved surveys', this.savedSurveys)
    return this.saveToStorage('savedSurveys', this.savedSurveys)
  }
  
  loadSurvey(survey) {
    this.activeSurvey = survey
    console.log('loading survey', survey)
    this.formPrvdr.initFormValues(survey.values)
  }

  saveSurvey() {
    // save entire survey to local storage
    return new Promise((resolve, reject) => {
      console.log('saving survey', this.activeSurvey)
      if (this.activeSurvey) {
        let title = this.activeSurvey.title
        this.savedSurveys[title] = this.activeSurvey
        this.activeSurvey.values = this.formPrvdr.formGroup.value
        this.activeSurvey._dbVersion = this._dbVersion
        console.log('saved surveys', this.savedSurveys)
        this.saveToStorage('savedSurveys', this.savedSurveys).then(
          _ => {
            this.showNotification('Progress Saved')
            resolve('saved')
          }
        )
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
          if(!survey._dbVersion || survey._dbVersion<this._dbVersion){delete this.savedSurveys[k]}
        })
        console.log('surveys loaded', this.savedSurveys)
      }
    )
  }

  // ***** general storage functions ***** //

  getFromStorage(key) {
    // general method to get key from storage. returns a promise, if data does not exist returns empty json object
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then(
        res => {
          if (res != null) { this.activeSurvey = res }
          resolve(this.activeSurvey)
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
    let mapping = { controlName: 'id', label: 'question', value: 'response' }
    var d = []
    for (let q of questionMeta) {
      let temp: any = {}
      if (q.isQuestion == "TRUE") {
        q['value'] = this.activeSurvey[q.controlName]
        Object.keys(mapping).forEach(key => {
          let map = mapping[key]
          temp[map] = q[key]
        })
        d.push(temp)
      }
    }
    const ws_name = 'Sampling Decisions';
    const wb: WorkBook = { SheetNames: [], Sheets: {} };
    const ws: any = utils.json_to_sheet(d);
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

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'sampling-decisions.xlsx');
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