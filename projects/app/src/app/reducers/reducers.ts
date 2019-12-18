import * as Actions from "../actions/actions";
import * as Models from "../models/models";
import { Action, Reducer } from "redux";

export const INITIAL_STATE: Models.AppState = {
  activeProject: null,
  savedProjects: null,
  editMode: false,
  view: null,
  _dbVersion: null,
  _platforms: null,
  _treeMeta: null
};

export function rootReducer(
  state: Models.AppState = INITIAL_STATE,
  action: Action
): Models.AppState {
  switch (action.type) {
    case Actions.ProjectActions.SAVE_PROJECT:
      const save = action as Actions.ProjectSaveAction;
      return Object.assign({}, state, { activeProject: save.payload });

    case Actions.ProjectActions.LOAD_PROJECT:
      const load = action as Actions.ProjectSaveAction;
      return Object.assign({}, state, { activeProject: load.payload });

    case Actions.ProjectActions.NEW_PROJECT:
      const newProject = action as Actions.ProjectSaveAction;

      return { ...state, activeProject: newProject.payload };

    case Actions.ProjectActions.LIST_PROJECTS:
      const list = action as Actions.ProjectSaveAction;
      return Object.assign({}, state, { savedProjects: list.payload });

    case Actions.ProjectActions.UPDATE_PROJECT_VALUES:
      const values = action as Actions.UpdateProjectAction;
      let valuesState = Object.assign({}, state);
      if (valuesState.activeProject) {
        valuesState.activeProject.values = values.payload as any;
      }
      return valuesState;

    case Actions.ProjectActions.UPDATE_STAGES_COMPLETE:
      const stages = action as Actions.UpdateProjectAction;
      let stagesState = Object.assign({}, state);
      if (stagesState.activeProject) {
        stagesState.activeProject.stagesComplete = stages.payload as any;
      }
      return stagesState;

    case Actions.ProjectActions.SET_META:
      const meta = action as Actions.UpdateProjectAction;
      return Object.assign({}, state, meta.payload);

    // view actions -  *** should be split to seperate reducer ***
    case Actions.ViewActions.SET_VIEW:
      const viewAction = action as Actions.UpdateProjectAction;
      return Object.assign({}, state, { view: viewAction.payload });

    case Actions.ViewActions.UPDATE_VIEW:
      const updateViewAction = action as Actions.UpdateProjectAction;
      const newView = Object.assign({}, state.view, updateViewAction.payload);
      return Object.assign({}, state, { view: newView });

    case Actions.ViewActions.UPDATE_VIEW_PARAMS:
      const updateViewParamsAction = action as Actions.UpdateProjectAction;
      const oldParams = state.view ? state.view.params : {};
      const newParams = Object.assign(
        {},
        oldParams,
        updateViewParamsAction.payload
      );
      let newParamsView = Object.assign({}, state.view);
      newParamsView.params = newParams;
      return Object.assign({}, state, { view: newParamsView });

    // tree diagram actions -  *** should be split to seperate reducer ***
    case Actions.TreeDiagramActions.SET_ACTIVE_NODE:
      // *** note, this is probably a better way to update nested properties than methods above... may want to update others
      // update state._treeMeta.activeNode
      const setActiveNode = action as Actions.UpdateProjectAction;
      return {
        ...state,
        _treeMeta: {
          ...state._treeMeta,
          activeNode: setActiveNode.payload as any
        }
      };

    case Actions.TreeDiagramActions.SET_NODES:
      const setNodes = action as Actions.UpdateProjectAction;
      return {
        ...state,
        _treeMeta: { ...state._treeMeta, nodes: setNodes.payload as any }
      };

    case Actions.TreeDiagramActions.SET_META:
      const treeMeta = action as Actions.UpdateProjectAction;
      return { ...state, _treeMeta: { ...state._treeMeta, ...treeMeta } };

    // dev actions -  *** should be split to seperate reducer ***
    case Actions.DevActions.EDIT_TOGGLE:
      const edit = action as Actions.UpdateProjectAction;
      return Object.assign({}, state, { editMode: edit.payload });

    default:
      return state;
  }
}
