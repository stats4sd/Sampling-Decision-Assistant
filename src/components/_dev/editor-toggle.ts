import { Component, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { DevActions } from '../../actions/actions';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { select } from '@angular-redux/store'

@Component({
  selector: 'dev-editor-toggle',
  template: `
  <button ion-button icon-left (click)="enableEdit()" *ngIf="!(editMode$|async)"><ion-icon name="bug"></ion-icon>Enable Editing</button>
  
  `
})
export class DevEditorToggleComponent {
  editMode: boolean
  @select('editMode') editMode$
  constructor(
    private db: AngularFirestore,
    private devActions: DevActions,
    private modal: ModalController) {
    console.log('db', db)
  }


  enableEdit() {
    this.devActions.toggleEditMode(true)
    //this.editMode = true
    // this.modal.create('EditorPage').present()

  }

  disableEdit() {
    this.devActions.toggleEditMode(false)
    //this.editMode = false
  }



}
