import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { FluxStandardAction } from 'flux-standard-action';
import { Project, SavedProjects } from '../models/models';

export type ProjectSaveAction = FluxStandardAction<Project, null>;
export type ProjectLoadAction = FluxStandardAction<Project, null>;
export type ProjectsListAction = FluxStandardAction<Project[], null>;
export type UpdateProjectAction = FluxStandardAction<any, string>;


@Injectable()
export class ProjectActions {
    static readonly SAVE_PROJECT = 'SAVE_PROJECT';
    static readonly LOAD_PROJECT = 'LOAD_PROJECT';
    static readonly NEW_PROJECT = 'NEW_PROJECT';
    static readonly LIST_PROJECTS = 'LIST_PROJECTS';
    static readonly UPDATE_PROJECT_VALUES = 'UPDATE_PROJECT_VALUES';
    static readonly UPDATE_STAGES_COMPLETE = 'UPDATE_STAGES_COMPLETE';
    static readonly SET_SLIDE_SECTION = 'SET_SLIDE_SECTION';
    static readonly SET_RELEVANT_RESOURCES = 'SET_RELEVANT_RESOURCES';
    
    // dev
    static readonly EDIT_TOGGLE = 'EDIT_TOGGLE';


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
    updateProjectValues = (values:any): UpdateProjectAction => ({
        type: ProjectActions.UPDATE_PROJECT_VALUES,
        meta: 'values',
        payload: values
    });

    @dispatch()
    updateStagesComplete = (arr:boolean[]): UpdateProjectAction => ({
        type: ProjectActions.UPDATE_STAGES_COMPLETE,
        meta: 'stagesComplete',
        payload: arr
    });

    @dispatch()
    setSlideSection = (index:number) => ({
        type: ProjectActions.SET_SLIDE_SECTION,
        meta: null,
        payload: index
    })
    @dispatch()
    setRelevantResources = (relevant:string) => ({
        type: ProjectActions.SET_RELEVANT_RESOURCES,
        meta: null,
        payload: relevant
    })

    // dev
    @dispatch()
    toggleEditMode = (editMode:boolean) => ({
        type: ProjectActions.EDIT_TOGGLE,
        meta: null,
        payload: editMode
    });

}