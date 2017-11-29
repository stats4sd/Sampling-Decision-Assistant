import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import {Events} from 'ionic-angular'

@Injectable()
export class DataProvider {
  surveyResults: any = {}

  constructor(public storage: Storage, private events:Events) {
    console.log('Data provider loaded, ready to save data');
    this.events.subscribe('valueUpdate',data=>this.saveResult(data.key,data.value))
  }

  saveResult(key, value) {
    // save an individual survey result
    this.surveyResults[key] = value
    console.log('saving survey',this.surveyResults)
    this.saveSurvey().then(
      _=>{console.log('result saved',key,value)}
    )
  }

  saveSurvey() {
    return this.saveToStorage('surveyResults',this.surveyResults)
  }
  loadSurvey(){
    return this.getFromStorage('surveyResults')
  }

  getSurveyValue(key){
    return this.surveyResults[key]
  }

  getFromStorage(key) {
    // get key from storage. returns a promise, if data does not exist returns empty json object
    return new Promise((resolve, reject) => {
      this.storage.get(key)
        .then(
        res => {
          if (res!=null) { this.surveyResults = res }
          resolve(this.surveyResults)
        }
        )
    })
  }
  saveToStorage(key, value) {
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
