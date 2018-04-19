import { Injectable } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { ViewActions } from '../../actions/actions';
import { NgRedux } from '@angular-redux/store';
import { AppState, ViewState, ViewStateParams } from '../../models/models';

/*
 Additional functions to enable better router performance including:
 - hash query parameters
 - page unload (future planned)
 - service workers (future planned)
*/
@Injectable()

export class CustomRouterProvider {
  constructor(private viewActions:ViewActions, protected app: App, private ngRedux:NgRedux<AppState>) {
    /* 
      monitor window hash changes and publish corresponding event. 
      need to process for every view load and unload. 
      Note, unload actually handled by window.onhashchange as this gets called only on unload
      for some reason and prevents double call when transitioning from one page to next (both on load and on leave).
      */
     
     this.app.viewDidLoad.subscribe(
      //  listen to page load on app as can't pass navCtrl into service constructor
      v => this.processHash()
    )
    window.onhashchange = () => {
      this.processHash()
    }
    // possible future function to prevent user accidentally navigating away from app entirely
    window.onbeforeunload = (e) => {
      console.log('page unload', e)
    }
  }

  // monitor the hash to determine which section is displayed and any additional information available in query-style params
  //  *** slightly messy workaround until a better routing system made available (ionic 4)
  processHash() {
    const hash = location.hash
    const hashParamsArr = location.hash.split('?')
    // calculate any params, identified by splitting '=' and assigning [0] : [1] elements as key-value pairs if exists
    let paramsObj = {}
    if (hashParamsArr.length == 2) {
      const params = hashParamsArr[1].split('&')
      params.forEach(param => {
        let p = param.split('=')
        if (p.length > 1) {
          paramsObj[p[0]] = p[1]
        }
      })
    }
    this.viewActions.setView({
      hash: hash,
      params: paramsObj
    })
  }

  // set current hash with given query parameters
  setHashParams(params:any){
    let view = { ...this.ngRedux.getState().view }
    view.params=params
    this.buildHash(view)
  }

  // edit given query parameters
  updateHashParams(params:ViewStateParams){
    let viewState = this.ngRedux.getState().view
    if(!viewState.params){viewState.params={}}
    viewState.params=Object.assign({},viewState.params,params)
    this.buildHash(viewState)
  }

  // reset default view part by removing a given param (e.g. removing section param defaults to 'main' section)
  removeHashParam(param){
    let viewState = this.ngRedux.getState().view
    if(viewState.params && viewState.params[param])
    delete viewState.params[param]
    this.buildHash(viewState)
  }

  // build full location hash and update
  buildHash(viewState:ViewState){
    let paramsArray = []
    Object.keys(viewState.params).forEach(key => {
      paramsArray.push(key + "=" + viewState.params[key])
    })
    let hashParams = paramsArray.join('&')
    // assign back to location hash
    location.hash = location.hash.split('?')[0] + '?' + hashParams
  }

  

}
