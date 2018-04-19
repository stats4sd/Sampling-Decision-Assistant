import * as Actions from '../actions/actions';
import * as Models from '../models/models';
import { Action } from 'redux';

export const INITIAL_STATE: Models.AppState = {
    activeProject: null,
    savedProjects: null,
    editMode: false,
    relevantResources: null,
    view:null,
    _dbVersion: null,
    _platforms:null
    // reviewMode:false
};

export function rootReducer(state: Models.AppState = INITIAL_STATE, action: Action) {
    switch (action.type) {
        case Actions.ProjectActions.SAVE_PROJECT:
            const save = action as Actions.ProjectSaveAction
            return Object.assign({}, state, { activeProject: save.payload })

        case Actions.ProjectActions.LOAD_PROJECT:
            const load = action as Actions.ProjectSaveAction
            return Object.assign({}, state, { activeProject: load.payload })

        case Actions.ProjectActions.NEW_PROJECT:
            const newProject = action as Actions.ProjectSaveAction
            return Object.assign({}, state, { activeProject: newProject.payload })

        case Actions.ProjectActions.LIST_PROJECTS:
            const list = action as Actions.ProjectSaveAction
            return Object.assign({}, state, { savedProjects: list.payload })

        case Actions.ProjectActions.UPDATE_PROJECT_VALUES:
            const values = action as Actions.UpdateProjectAction
            // merge values
            let valuesState = Object.assign({}, state)
            if (valuesState.activeProject) {
                valuesState.activeProject.values = values.payload
            }
            return valuesState

        case Actions.ProjectActions.UPDATE_STAGES_COMPLETE:
            const stages = action as Actions.UpdateProjectAction
            let stagesState = Object.assign({}, state)
            if (stagesState.activeProject) {
                stagesState.activeProject.stagesComplete = stages.payload
            }
            return stagesState

        case Actions.ProjectActions.SET_SLIDE_SECTION:
            const section = action as Actions.UpdateProjectAction
            return Object.assign({}, state, { slideSection: section.payload })

        case Actions.ProjectActions.SET_RELEVANT_RESOURCES:
            const relevant = action as Actions.UpdateProjectAction
            return Object.assign({}, state, { relevantResources: relevant.payload })


        case Actions.ProjectActions.SET_META:
            const meta = action as Actions.UpdateProjectAction
            return Object.assign({}, state, meta.payload)

        // view actions -  *** should be split to seperate reducer ***
        case Actions.ViewActions.SET_VIEW:
            const viewAction = action as Actions.UpdateProjectAction
            return Object.assign({}, state, {view:viewAction.payload})


        // dev actions -  *** should be split to seperate reducer ***
        case Actions.DevActions.EDIT_TOGGLE:
            const edit = action as Actions.UpdateProjectAction
            return Object.assign({}, state, { editMode: edit.payload })




        default: return state
    }
}