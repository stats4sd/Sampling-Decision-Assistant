import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';


@Injectable()
export class UserProvider {

  constructor(private storage:Storage) {
    
  }

}
