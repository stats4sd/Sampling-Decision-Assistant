// models for how variables should be stored

export interface Project {
    title: string,
    created: string,
    values: any,
    stagesComplete:boolean[],
    draft:boolean
}

export type SavedProjects = Project[]

export interface AppState {
    activeProject? : Project,
    lastProject? : Project,
    databaseVersion?: string,
    savedProjects? : Project[],
}