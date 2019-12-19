import { Question } from "../models/models";

/**
 * 2019-12-16 - decided to simplify use of both reportingLevels and strata
 * but want to retain levels as 'disaggregation'
 */
export const getControlName = (controlName: Question["controlName"]) => {
  switch (controlName) {
    case "reportingLevels":
      return "disaggregation";
    default:
      return controlName;
  }
};

// TODO
// - Remove reporting required (no longer used)
