import { Component, ViewChildren, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, ModalController } from 'ionic-angular';
import { DataProvider } from '../../../providers/data/data'
import { NgRedux } from '@angular-redux/store';
import { AppState } from '../../../models/models';

@IonicPage({
  defaultHistory: ['HomePage', 'StepByStepPage']
})
@Component({
  selector: 'page-review',
  templateUrl: 'review.html',
})
export class ReviewPage {
  questionGroups: any = [];
  @ViewChildren('survey') surveys;
  canvasImage: any;
  showIntro: boolean = true;
  viewSection: number = 0;


  constructor(private modalCtrl: ModalController, private dataPrvdr: DataProvider, private ngRedux: NgRedux<AppState>) {
    // load question meta from questionMeta.ts and seperate out into question groups for binding to survey question components
    console.log('generating question groups')
    this._generateQuestionGroups()
  }


  _generateQuestionGroups() {
    let groups = {}
    this.dataPrvdr.questionMeta.forEach(q => {
      if (!groups[q.section]) {
        groups[q.section] = {
          section: q.section,
          questions: []
        }
      }
      groups[q.section].questions.push(q)
    })
    console.log('groups', groups)
    Object.keys(groups).forEach(k => {
      const val = groups[k]
      this.questionGroups.push(val)
    })
    console.log('question groups', this.questionGroups)
  }


  startNew() {
    let modal = this.modalCtrl.create('SavedInfoPage', { view: 'save' });
    modal.onDidDismiss(data => {
      if (data) { this.showIntro = false }
    })
    modal.present()
  }

  exportXLSX() {
    this.dataPrvdr.exportXLSX()
  }

  hideIntro() {
    this.showIntro = false;
  }

  exportTreeImage() {
    const project = this.ngRedux.getState().activeProject
    const canvas = document.querySelector('canvas');
    console.log('canvas', canvas)
    const dataURL = canvas.toDataURL('image/png');
    let exportFileDefaultName = project.title + '.png';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataURL);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    console.log(dataURL);
  }

  exportJSON() {
    const project = this.ngRedux.getState().activeProject
    const dataStr: string = JSON.stringify(project)
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = project.title + '.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

  }

  download(data,extension){


  }

}






