import * as Actions from '../actions/actions';
import * as Models from '../models/models';
import { Action } from 'redux';

export const INITIAL_STATE: Models.AppState = {
  activeProject: null,
  lastProject:null,
  databaseVersion:null,
  savedProjects:null
};

export function rootReducer(state: Models.AppState = INITIAL_STATE, action: Action){
    switch (action.type) {
        case Actions.ProjectActions.SAVE_PROJECT:
            const update = action as Actions.ProjectSaveAction
            return Object.assign({},state,{activeProject:update.payload})

        
            
        default: return state
    }
}