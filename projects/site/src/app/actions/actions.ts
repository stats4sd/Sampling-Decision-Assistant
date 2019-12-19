import { Injectable } from "@angular/core";
import { dispatch } from "@angular-redux/store";
import { FluxStandardAction } from "flux-standard-action";
import {
  Project,
  ViewState,
  TreeDiagramNode,
  TreeState
} from "../models/models";

export type ProjectSaveAction = FluxStandardAction<string, Project>;
export type ProjectLoadAction = FluxStandardAction<string, Project>;
export type ProjectsListAction = FluxStandardAction<string, null>;
export type UpdateProjectAction = FluxStandardAction<string, any, string>;

@Injectable({
  providedIn: "root"
})
export class ProjectActions {
  static readonly SAVE_PROJECT = "SAVE_PROJECT";
  static readonly LOAD_PROJECT = "LOAD_PROJECT";
  static readonly NEW_PROJECT = "NEW_PROJECT";
  static readonly LIST_PROJECTS = "LIST_PROJECTS";
  static readonly UPDATE_PROJECT_VALUES = "UPDATE_PROJECT_VALUES";
  static readonly UPDATE_STAGES_COMPLETE = "UPDATE_STAGES_COMPLETE";
  static readonly SET_SLIDE_SECTION = "SET_SLIDE_SECTION";
  static readonly SET_META = "SET_META";

  @dispatch()
  saveProject = (project: Project): ProjectSaveAction => ({
    type: ProjectActions.SAVE_PROJECT,
    meta: null,
    payload: project
  });

  @dispatch()
  setActiveProject = (project: Project): ProjectLoadAction => ({
    type: ProjectActions.LOAD_PROJECT,
    meta: null,
    payload: project
  });

  @dispatch()
  setNewProject = (project: Project): ProjectLoadAction => ({
    type: ProjectActions.NEW_PROJECT,
    meta: null,
    payload: project
  });

  @dispatch()
  listProjects = (savedProjects): ProjectsListAction => ({
    type: ProjectActions.LIST_PROJECTS,
    meta: null,
    payload: savedProjects
  });

  @dispatch()
  updateProjectValues = (values: any): UpdateProjectAction => ({
    type: ProjectActions.UPDATE_PROJECT_VALUES,
    meta: "values",
    payload: values
  });

  @dispatch()
  updateStagesComplete = (arr: boolean[]): UpdateProjectAction => ({
    type: ProjectActions.UPDATE_STAGES_COMPLETE,
    meta: "stagesComplete",
    payload: arr
  });

  // generic method to set any top level meta data
  @dispatch()
  setMeta = (meta: any) => ({
    type: ProjectActions.SET_META,
    meta: null,
    payload: meta
  });
}

@Injectable({
  providedIn: "root"
})
export class ViewActions {
  static readonly SET_VIEW = "SET_VIEW";
  static readonly UPDATE_VIEW = "UPDATE_VIEW";
  static readonly UPDATE_VIEW_PARAMS = "UPDATE_VIEW_PARAMS";

  @dispatch()
  // set entire view
  setView = (view: ViewState) => ({
    type: ViewActions.SET_VIEW,
    meta: null,
    payload: view
  });

  @dispatch()
  // set portion of view
  updateView = (update: ViewState, meta?: string) => ({
    type: ViewActions.UPDATE_VIEW,
    meta: meta,
    payload: update
  });
}

@Injectable({
  providedIn: "root"
})
export class TreeDiagramActions {
  static readonly SET_ACTIVE_NODE = "SET_ACTIVE_NODE";
  static readonly SET_NODES = "SET_NODES";
  static readonly SET_META = "SET_META";

  @dispatch()
  setActiveNode = (activeNode: TreeDiagramNode) => ({
    type: TreeDiagramActions.SET_ACTIVE_NODE,
    meta: null,
    payload: activeNode
  });

  @dispatch()
  setNodes = (nodes: TreeDiagramNode[]) => ({
    type: TreeDiagramActions.SET_NODES,
    meta: null,
    payload: nodes
  });

  @dispatch()
  setMeta = (meta: TreeState) => ({
    type: TreeDiagramActions.SET_META,
    meta: null,
    payload: meta
  });
}

@Injectable({
  providedIn: "root"
})
export class DevActions {
  static readonly EDIT_TOGGLE = "EDIT_TOGGLE";

  @dispatch()
  toggleEditMode = (editMode: boolean) => ({
    type: DevActions.EDIT_TOGGLE,
    meta: null,
    payload: editMode
  });
}
