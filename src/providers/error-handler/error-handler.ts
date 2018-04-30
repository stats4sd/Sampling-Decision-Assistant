import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Observable} from 'rxjs/Observable';
import { IonicErrorHandler } from 'ionic-angular';
import Raven from 'raven-js'
import { AppState } from '../../models/models';
import { NgRedux } from '@angular-redux/store';
// info at: https://gonehybrid.com/how-to-log-errors-in-your-ionic-2-app-with-sentry/
// dashboard at: https://sentry.io/onboarding/statistics-for-sustainable-dev/sampling-decision-assistant


Raven
  .config('https://e0a8fd91c39e48ba94a465900e4ab2da@sentry.io/1198240')
  .install();



@Injectable()
export class SentryErrorHandler extends IonicErrorHandler {
  constructor(private ngRedux:NgRedux<AppState>){
    super()
  }


  handleError(error) {
    // super.handleError(error);
    
    try {
      Raven.setExtraContext({
        appState:this.ngRedux.getState()
      })
      console.error(error);
      Raven.captureException(error.originalError || error);
    }
    catch (e) {
      console.error(e);
    }
  }

}