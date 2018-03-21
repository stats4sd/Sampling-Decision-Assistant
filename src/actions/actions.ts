import { Injectable } from '@angular/core';
import { dispatch } from '@angular-redux/store';
import { FluxStandardAction } from 'flux-standard-action';
import { Project, SavedProjects } from '../models/models';

export type ProjectSaveAction = FluxStandardAction<Project, null>;
export type ProjectLoadAction = FluxStandardAction<Project, null>;
export type ProjectsListAction = FluxStandardAction<Project[], null>;


@Injectable()
export class ProjectActions {
    static readonly SAVE_PROJECT = 'SAVE_PROJECT';
    static readonly LOAD_PROJECT = 'LOAD_PROJECT';
    static readonly LIST_PROJECTS = 'LIST_PROJECTS';


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
    listProjects = (savedProjects): ProjectsListAction => ({
        type: ProjectActions.LIST_PROJECTS,
        meta: null,
        payload: savedProjects
    });

}