import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import questionMeta from './questionMeta';

@Injectable()
export class DataProvider {
  surveyResults: any = {};
  questionMeta = questionMeta;
  public sectionMeta: any

  constructor(public storage: Storage, private events: Events) {
    console.log('Data provider loaded, ready to save data');
    this.events.subscribe('valueUpdate', data => this.saveResult(data.key, data.value))


  }

  // ***** specific survey functions ***** //
  saveResult(key, value) {
    // save an individual survey result
    this.surveyResults[key] = value
    console.log('saving survey', this.surveyResults)
    this.saveSurvey().then(
      _ => { console.log('result saved', key, value) }
    )
  }
  getSurveyValue(key) {
    // get individual question result
    return this.surveyResults[key]
  }
  getSectionMeta() {
    return new Promise((resolve, reject) => {
      if (this.sectionMeta) { resolve(this.sectionMeta) }
      else {
        this.loadSurvey().then(_=>resolve(this.sectionMeta))
      }
    })


  }
  saveSurvey() {
    // save entire survey to local storage
    return this.saveToStorage('surveyResults', this.surveyResults)
  }
  loadSurvey() {
    // load survey from local storage, resolve once processed
    return new Promise((resolve, reject) => {
      this.getFromStorage('surveyResults').then(
        _ => {
          this._processSectionMeta();
          resolve()
        }
      )
    })


  }


  // ***** user navigation and experience functions ***** //
  _processSectionMeta() {
    // return available app sections with question groups and progress update
    let sections = {}
    this.sectionMeta={_asArray: []}
    this.questionMeta.forEach(q => {
      if (q.controlName != "") {
        // add any saved values
        let savedValue = this.surveyResults[q.controlName]
        if (savedValue != undefined) { q['value'] = savedValue }
        if (!sections.hasOwnProperty(q.section)) {
          sections[q.section] = {}
          sections[q.section].name = q.section
          sections[q.section].questions = []
        }
        sections[q.section].questions.push(q)
      }
    })
    console.log('sections', sections)
    this.sectionMeta = sections
  }





  // ***** general storage functions ***** //

  getFromStorage(key) {
    // general method to get key from storage. returns a promise, if data does not exist returns empty json object
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then(
        res => {
          if (res != null) { this.surveyResults = res }
          resolve(this.surveyResults)
        }
        )
    })
  }
  saveToStorage(key, value) {
    // general method to save object to storage (can be any format, will automatically stringify arrays or objects and parse on get)
    return this.storage.set(key, value)
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
