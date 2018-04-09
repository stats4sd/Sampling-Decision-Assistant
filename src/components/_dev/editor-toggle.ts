import { Component, Input } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ProjectActions } from '../../actions/actions';
import { NavController, ModalController, ToastController } from 'ionic-angular';
import { select } from '@angular-redux/store'

@Component({
  selector: 'dev-editor-toggle',
  template: `
  <button ion-button icon-left (click)="enableEdit()" *ngIf="!(editMode$|async)"><ion-icon name="bug"></ion-icon>Edit</button>
  
  `
})
export class DevEditorToggleComponent {
  editMode: boolean
  @select('editMode') editMode$
  constructor(
    private db: AngularFirestore,
    private actions: ProjectActions,
    private modal: ModalController) {
    console.log('db', db)
  }


  enableEdit() {
    this.actions.toggleEditMode(true)
    //this.editMode = true
    // this.modal.create('EditorPage').present()

  }

  disableEdit() {
    this.actions.toggleEditMode(false)
    //this.editMode = false
  }



}
