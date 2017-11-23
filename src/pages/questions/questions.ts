import { Component, ViewChildren, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { File } from '@ionic-native/file';
import questionMeta from './questionMeta'

@IonicPage()
@Component({
  selector: 'page-questions',
  templateUrl: 'questions.html',
})
export class QuestionsPage {
  questionGroups: any = [];
  responses: any = {};
  questionMeta: any;
  @ViewChildren('survey') surveys;
  canvasImage: any;


  constructor(private file: File) {
    // load question meta from questionMeta.ts and seperate out into question groups for binding to survey question components
    this.questionMeta = questionMeta
    this._generateQuestionGroups()
  }

  ionViewDidLoad() {

  }

  _generateQuestionGroups() {
    // split questions into groups by section
    let groups = {}
    this.questionMeta.forEach(q => {
      // split questions into corresponding sections
      if (q.controlName != "") {
        if (!groups.hasOwnProperty(q.section)) {
          groups[q.section] = {}
          groups[q.section].questions = []
        }
        groups[q.section].questions.push(q)
      }
    });
    // push groups object to json array
    for (let key in groups) {
      if (groups.hasOwnProperty(key)) {
        let group = groups[key]
        group._name = key
        this.questionGroups.push(group)
      }
    }
    console.log('question groups', this.questionGroups)

  }
  save() {
    let responses = {}
    this.surveys._results.forEach(survey => {
      let formValues = survey.formGroup.value
      responses = Object.assign(responses, formValues);
    });

    this.responses = responses
    console.log('responses', this.responses)
  }

  load() {

  }
  print() {
    this._generatePdf()
  }

  _generatePdf() {
    // somewhat tricky method to try and output contents to a pdf doc
    // needs to first create clone of element off screen for proper rendering
    
    var pdf = new jsPDF
    var offScreen = document.querySelector('.pdf-output');
    // Clone off-screen element
    var clone = hiddenClone(offScreen);
    // Use clone with htm2canvas and delete clone
    html2canvas(clone, {}).then(canvas => {
      // document.getElementById("outputImage").appendChild(canvas)
      document.body.removeChild(clone);
      // generate pdf from canvas image
      var doc = new jsPDF("p", "mm", "a4");
      let imgData = canvas.toDataURL("image/PNG");
      doc.addImage(imgData, 'PNG', 20, 20);
      let pdfOutput = doc.output();
      // using ArrayBuffer will allow you to put image inside PDF
      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }
      doc.save('output.pdf')
    })
  }
}

function hiddenClone(element) {
  // Create clone of element
  var clone = element.cloneNode(true);
  // Position element relatively within the 
  // body but still out of the viewport
  var style = clone.style;
  style.position = 'relative';
  style.top = window.innerHeight + 'px';
  style.left = 0;
  // Append clone to body and return the clone
  document.body.appendChild(clone);
  return clone;
}


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




