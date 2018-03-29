// models for how variables should be stored

export interface Project {
    title?: string,
    created: number,
    edited: number,
    values: any,
    stagesComplete: boolean[],
    incompatible?: boolean,
    draft?: boolean
}

export type SavedProjects = Project[]

export interface AppState {
    activeProject?: Project,
    databaseVersion?: string,
    savedProjects?: Project[],
    editMode?:boolean,
    slideSection?:number
}

export interface Question {
    isQuestion: string,
    controlName: string,
    repeatGroup?: string,
    type: string,
    selectOptions?: string,
    label: string,
    section: string,
    condition?: string,
    labelMultiple?: string,
    options?:any,
    triggers?:any,
    conditionJson?:any
    
}