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
    _treeMeta:TreeState;
}

export interface ViewState{
    params?:ViewStateParams,
    hash?:string,
    activeStageID?:string,
    lockHash?:string
}

export interface ViewStateParams{
    stagePart?:number,
    activeGlossaryTerm?:string,
    tabSection?:'resources' | 'glossary',
    relevant?:string
}

export interface TreeState{
    activeNode:TreeDiagramNode
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

// tree diagram
export interface TreeDiagramNode{
    id:string,
    color:TreeDiagramNodeColor,
    label:string,
    shape:string
}
export interface TreeDiagramNodeColor{
    background:string,
    border:string,
    highlight:TreeDiagramNodeNodeColorHighlight
}

export interface TreeDiagramNodeNodeColorHighlight{
    background:string,
    border:string
}