// models for how variables should be stored

export interface Project {
    title?: string,
    created: number,
    edited: number,
    values: any,
    stagesComplete: boolean[],
    dbVersion:number,
    draft?: boolean
}

export type SavedProjects = Project[]

export interface AppState {
    activeProject?: Project,
    savedProjects?: Project[],
    editMode?:boolean,
    reviewMode?:boolean,
    
    view:ViewState
    _dbVersion?: number,
    _platforms?:string[],
}

export interface ViewState{
    params?:ViewStateParams,
    hash?:string,
    activeStageID?:string
}

export interface ViewStateParams{
    stagePart?:number,
    activeGlossaryTerm?:string,
    tabSection?:'resources' | 'glossary',
    relevant?:string
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

export interface glossaryTerm{
    slug:string,
    definition:string,
    term:string
}