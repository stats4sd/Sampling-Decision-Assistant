import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { Events } from 'ionic-angular'
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { query } from '@angular/core/src/animation/dsl';
import {DataProvider} from '../../providers/data/data'



@Component({
  selector: 'survey-question-group',
  templateUrl: 'survey-question-group.html'
})
export class SurveyQuestionGroupComponent {
  @Input('questions') questions;
  @Input('questionNumber') questionNumber;
  @Input('showLabel') showLabel: boolean;
  @Input('repeatGroup') repeatGroup: string;
  @Input('repeatGroupKey') repeatGroupKey: string;
  formGroup: FormGroup;
  groupQuestions: any;
  section: any;

  constructor(private fb: FormBuilder, private cdr: ChangeDetectorRef, private events: Events,private dataPrvdr:DataProvider) {


  }

  ngAfterViewInit() {
    if (this.questions) {
      // slice for individual question if question number provided
      this.section = this.questions[0].section;
      let questions = this.questions
      if (this.questionNumber) {
        questions = [this.questions[this.questionNumber - 1]]
      }
      this._generateQuestionForm(questions)
    }
    else{
      // generate from dynamic group by matching repeat group in all questions (e.g. repeat group q5.3 returns sub qs 5.3.1, 5.3.2 etc)
      let groupQuestions = this.dataPrvdr.questionMeta.filter(q=>{
        if(q.controlName.indexOf(this.repeatGroup)>-1){
          // don't return back repeat group itself
          if(q.controlName!=this.repeatGroup){
            return true
          }
        }
      })
      // apply alphabet suffix to control name 
      // * no, better to add formgroup
      // http://brianflove.com/2016/10/16/dynamic-form-group-custom-validation-angular2/
      
      // let prefixes = ["a","b","c","d","e","f","g","h","i","j","k","l","m"]
      // let formControl:FormControl = new formControl('')
      // groupQuestions = groupQuestions.map((q,index)=>{
      //   q.controlName=q.controlName+prefixes[index]
        
      //   this.formGroup.addControl(q.controlName,'')
      //   return q
      // })
      this._generateQuestionForm(groupQuestions,this.repeatGroupKey)
      console.log('group questions',groupQuestions)

    }



  }


  _generateQuestionForm(questions, log?) {
    // uses the formbuilder to a form from an array of questions provided
    let questionGroup = {}
    // generate conditions
    questions = questions.map(q => {
      if (q.condition != "") { return this._generateConditionOptions(q) }
      else { return q }
    })
    questions.forEach(q => {
      // split questions into corresponding sections
      if (!q.value) { questionGroup[q.controlName] = "" }
      questionGroup[q.controlName] = q.value

    });
    // build formgroup sections appropriately
    this.formGroup = this.fb.group(questionGroup)
    if(log){console.log('formgroup',log, this.formGroup)}
    this.groupQuestions = questions
    this.cdr.detectChanges()
  }

  _addSubQuestion(template) {
    // create nested group
    return this.fb.group(template)
  }

  _generateConditionOptions(question) {
    // take text condition string and turn into json element for use in show logic function
    let json = {}
    let propertiesString = question.condition
    let propertiesArray = propertiesString.split(',')
    propertiesArray.forEach(el => {
      let a = el.split(':');
      let key = a[0].trim();
      let val = a[1].trim();
      json[key] = val
    });
    question.conditionJson = json
    return question
  }

  shouldShowQuestion(question) {
    // test logic from condition property against form
    // currently implemented for specific previous values
    if (question.hasOwnProperty('conditionJson')) {
      let condition = question.conditionJson
      if (this.formGroup && this.formGroup.value) {
        if (this.formGroup.value.hasOwnProperty(condition.controlName)) {
          // match value if based on value, otherwise match exist if based on prerequisite
          // if( condition.type=="prerequisite" && this.formGroup.value[condition.controlName] && this.formGroup.value[condition.controlName] != ""){
          //   return true
          // }
          if (this.formGroup.value[condition.controlName] == condition.value) {
            return true
          }
          else { return false }
        }
      }
      return false
    }
    return true
  }

}
