import resources from "../../../../../data/resources.json";
import glossary from "../../../../../data/glossary.json";
import questions from "../../../../../data/questions.json";
import {
  IGlossaryTerm,
  IStageResources,
  Project,
  IQuestionMeta
} from "../models/models.js";
import examples from "../../../../../data/examples/index";

interface exportedData {
  __collections__?: any;
}
interface allGlossaryObj {
  [slug: string]: IGlossaryTerm & exportedData;
}
interface allResourceObj {
  [stageNResources: string]: IStageResources & exportedData;
}
export const ALL_RESOURCES: allResourceObj = resources;
export const ALL_GLOSSARY: allGlossaryObj = glossary;
export const ALL_QUESTIONS: IQuestionMeta[] = questions as IQuestionMeta[];
export const ALL_EXAMPLES: Project[] = examples as Project[];
