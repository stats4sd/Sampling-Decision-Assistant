import { Component } from "@angular/core";
import { DevActions } from "../../actions/actions";
import { select } from "@angular-redux/store";

@Component({
  selector: "dev-editor-toggle",
  template: `
  ion-buttonn icon-left (click)="enableEdit()" *ngIf="!(editMode$|async)"><ion-icon name="create"></ion-icon>Edit Glossary and Resources<ion-buttonn>
  
  `
})
export class DevEditorToggleComponent {
  editMode: boolean;
  @select("editMode")
  editMode$;
  constructor(private devActions: DevActions) {}

  enableEdit() {
    this.devActions.toggleEditMode(true);
    //this.editMode = true
    // this.modal.create('EditorPage').present()
  }

  disableEdit() {
    this.devActions.toggleEditMode(false);
    //this.editMode = false
  }
}
