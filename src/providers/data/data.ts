import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Events, ToastController } from 'ionic-angular';
import questionMeta from './questionMeta';
// import * as XLSX from 'xlsx';
import { utils, write, WorkBook } from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable()
export class DataProvider {
  public savedSurveys: any
  public activeSurvey: any
  questionMeta = questionMeta;
  public sectionMeta: any = {}

  constructor(public storage: Storage, private events: Events, public toastCtrl: ToastController) {
    console.log('Data provider loaded, ready to save data');
    this.events.subscribe('valueUpdate', data => this.saveResult(data.key, data.value))
    this.loadSavedSurveys()
  }

  // ***** specific survey functions ***** //
  saveResult(key, value) {
    // save an individual survey result
    if (this.activeSurvey) {
      console.log('saving results', this.activeSurvey)
      this.activeSurvey[key] = value
      // console.log('saving survey', this.activeSurvey)
      // this.saveSurvey()
    }

  }
  createNewSurvey(title) {
    this.activeSurvey = {
      _title: title,
      _created: new Date()
    }
    console.log('new survey created', this.activeSurvey)
    this.savedSurveys[title] = this.activeSurvey
    this.saveSurvey();
  }
  deleteSurvey(title) {
    console.log('deleting', title, this.savedSurveys)
    if (this.activeSurvey._title == title) {
      this.activeSurvey = null
    }
    delete this.savedSurveys[title]
    if (!this.savedSurveys) { this.savedSurveys = {} }
    console.log('saved surveys', this.savedSurveys)
    return this.saveToStorage('savedSurveys', this.savedSurveys)
  }
  setActiveSurvey(survey) {
    this.activeSurvey = survey
    console.log('survey set', this.activeSurvey)
  }
  getSurveyValue(key) {
    // get individual question result
    if (this.activeSurvey) {
      return this.activeSurvey[key]
    }
    else return

  }

  getSectionMeta(section?) {
    this._processSectionMeta();
    console.log('section meta processed', this.sectionMeta)
    if (section) { return this.sectionMeta[section] }
    else { return this.sectionMeta }

  }
  saveSurvey() {
    // save entire survey to local storage
    return new Promise((resolve, reject) => {
      console.log('saving survey', this.activeSurvey)
      if (this.activeSurvey) {
        let title = this.activeSurvey._title
        this.savedSurveys[title] = this.activeSurvey
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
        console.log('surveys loaded', this.savedSurveys)
      }
    )
  }

  // ***** user navigation and experience functions ***** //
  _processSectionMeta() {
    // return available app sections with question groups (and maybe progress update in future??)
    let survey = this.activeSurvey ? this.activeSurvey : {}
    console.log('processing', survey)
    let sections = {}
    this.sectionMeta = { _asArray: [] }
    this.questionMeta.forEach(q => {
      if (q.controlName != "") {
        // create section placeholder
        let sectionName = q.section
        if (!sections.hasOwnProperty(sectionName)) {
          sections[sectionName] = {}
          sections[sectionName].name = sectionName
          sections[sectionName].questions = []
        }
        // add any saved values
        let temp: any = q;
        let savedValue = survey[q.controlName]
        if (savedValue != undefined) {
          temp.value = savedValue
        }
        // console.log('pushing temp',temp)
        sections[sectionName].questions.push(temp)
      }
    })
    this.sectionMeta = sections
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
    let mapping = { controlName: 'id', value: 'response', label: 'question' }
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
    const ws_name = 'SomeSheet';
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
