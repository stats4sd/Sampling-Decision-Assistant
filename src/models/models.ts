// models for how variables should be stored

export interface Project {
    title?: string,
    created: number,
    edited: number,
    values: any,
    stagesComplete: boolean[],
    dbVersion:number,
    incompatible?: boolean,
    draft?: boolean
}

export type SavedProjects = Project[]

export interface AppState {
    activeProject?: Project,
    savedProjects?: Project[],
    editMode?:boolean,
    reviewMode?:boolean,
    slideSection?:number,
    relevantResources:string,
    _dbVersion?: number,
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

export interface reportingLevel{
    name:string,
    classifications:reportingLevelClassification
}

export interface reportingLevelClassification{
    names:string[],
    total:string
}