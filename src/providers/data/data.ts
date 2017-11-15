// Service to store and retrieve data that will be passed between different sections of the app

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProvider {

  constructor(public http: Http) {
    console.log('Hello DataProvider Provider');
  }

}
