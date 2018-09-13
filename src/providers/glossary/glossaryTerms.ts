import { IGlossaryTerm } from "../../models/models";

export const TERMS: IGlossaryTerm[] = [
  {
    term: "area sample frame",
    definition:
      "An area sampling frame comprises the geographical units of the area under study (e.g. a camp, a country, a programme area) in a hierarchical arrangement. For example, a list of the districts in a programme area is an area sampling frame. An area sampling frame differs from a list sampling frame in that it does not list the final sampling units (e.g. households) individually, but instead lists the geographical units they are contained in.",
    links: null,
    slug: "area-sample-frame"
  },
  {
    term: "area sampling",
    definition:
      "A method of sampling when no complete list sampling frame is available. The total area under investigation is divided into small sub-areas which are sampled at random. Each of the chosen sub-areas is then used to select sampling units from. Area sampling is a form of multi-stage sampling that uses geographic areas as first-stage primary sampling units.",
    links: null,
    slug: "area-sampling"
  },
  {
    term: "baseline",
    definition:
      "A baseline study is done to understand what the original situation at the beginning of a programme, project or intervention is. It measures the status quo before the intervention is rolled out. Results from the baseline are used to be compared against studies at later stages of the intervention (midline or endline) in order to assess the changes that happened between the baseline and later studies.",
    links: null,
    slug: "baseline"
  },
  { term: "bias", definition: "", links: null, slug: "bias" },
  {
    term: "census",
    definition:
      "A population census is the total process of collecting, compiling, evaluating, analysing and publishing or otherwise disseminating demographic, economic and social data pertaining, at a specified time, to all persons in a country or in a welldelimited part of a country. The essential features of a census are: a) Individual enumeration of persons as sampling units, b) all persons within a precisely defined territory (e.g. country or province) are enumerated, i.e. for a census it is not enough to enumerate a subset (sample) of the population, c) enumeration for all sampling units is simultaneous at a specified point in time, d) the census is repeated at scheduled regular intervals. ",
    links: null,
    slug: "census"
  },
  {
    term: "cluster sampling",
    definition:
      "When the basic sampling unit in the population is to be found in groups or clusters, e.g. households beings in villages, the sampling is sometimes carried out by selecting a sample of clusters (e.g. villages) and observing all or a subset of the sampling units of each selected cluster. If all sampling units of a cluster are selected, this is known as one-stage cluster sampling. If a random selection of the sampling units in each cluster is interviewed, it is referred to as two-stage cluster sampling. In some cases, the first-stage clusters (also called primary sampling units) contain not the final sampling units, but another form of clusters as the second-stage clusters. This is a third-stage cluster samplign design. For example, the primary sampling units in an urban setting could be enumeration areas, of which a random selection is drawn. In a second step, the selected enumeration areas are divived into blocks, of which again a random selection is drawn for each enumeration area. In a final step, a simple random sample of households is drawn in each selected block. \nThe clusters should always be non-overlapping and complete. Furthermore, it is recommended that clusters are mutually homogeneous, meaning that clusters resemble each other with regards to their internal composition of sampling units. The big advantage of cluster sampling is that a full list frame of the final sampling units(e.g.households) is not required.Only lists of the the final sampling units for the higher-level sampling units(e.g.city blocks) that were selected are needed.Even this requirement can be dropped if the final sampling units are randomly selected using techniques such as GPS sampling, the EPI method(spin the pen/bottle), or community-built sampling frames. Another advantage is that(if the clusters are geographical, i.e.the final sampling units in a cluster are geographically close) cluster sampling reduces the need to visit many different locations, thereby bringing down travel costs and time. The main disadvantage is that the cluster design decreases the efficiency of the sample.This means that a higher sample size is required compared to simple random sampling(see also design effect).",
    links: null,
    slug: "cluster - sampling"
  },
  {
    term: "community built sampling frames",
    definition: "",
    links: null,
    slug: "community-built-sampling-frames"
  },
  { term: "design effect", definition: "", links: null, slug: "design-effect" },
  {
    term: "disaggregate estimates",
    definition: "",
    links: null,
    slug: "disaggregate-estimates"
  },
  { term: "endline", definition: "", links: null, slug: "endline" },
  { term: "EPI-method", definition: "", links: null, slug: "EPI-method" },
  {
    term: "estimation",
    definition:
      "The process of infering the value of an unknown parameter in a population from a subset (sample) of this population. A key aspect of an estimation is that measurements only for a subset of the population are available.",
    links: null,
    slug: "estimation"
  },
  { term: "experiments", definition: "", links: null, slug: "experiments" },
  {
    term: "external validity",
    definition: "",
    links: null,
    slug: "external-validity"
  },
  {
    term: "final sampling unit",
    definition: "",
    links: null,
    slug: "final-sampling-unit"
  },
  { term: "GPS sampling", definition: "", links: null, slug: "GPS-sampling" },
  {
    term: "hypothesis testing",
    definition: "",
    links: null,
    slug: "hypothesis-testing"
  },
  { term: "idp", definition: "", links: null, slug: "idp" },
  {
    term: "indicator",
    definition:
      "A means of measuring actual results against planned or expected results in terms of quantity, quality and timeliness. An indicator is a variable that measures a concept. It is very important that a) you can measure the indicator and b) the indicator is specific, meaning it measures the concept exactly and there is no ambiguity.  ",
    links: null,
    slug: "indicator"
  },
  { term: "inference", definition: "", links: null, slug: "inference" },
  {
    term: "internal validity",
    definition: "",
    links: null,
    slug: "internal-validity"
  },
  {
    term: "intra cluster correlation",
    definition: "",
    links: null,
    slug: "intra-cluster-correlation"
  },
  {
    term: "key informants",
    definition: "",
    links: null,
    slug: "key-informants"
  },
  {
    term: "list sample frame",
    definition:
      "A list sampling frame is a frame made up of a list of the target population units. It differs from an area sampling frame in that the area frame does not list the individual units, but simply the geographic divisions they are contained in. A list frame lists each sampling unit individually and can be easily used to draw a random sample from.",
    links: null,
    slug: "list-sample-frame"
  },
  {
    term: "listing",
    definition:
      "Procedure to list all sampling units in a selected area (for example in the selected primary sampling units) with the aim of obtaining a full list to sample from, together with auxiliary information (e.g. household size, sex of head of household etc) to facilitate stratification. A successful listing exercise must include all sampling units of the pre-defined population of interest without exceptions. ",
    links: null,
    slug: "listing"
  },
  {
    term: "main objective",
    definition: "",
    links: null,
    slug: "main-objective"
  },
  {
    term: "margin of error",
    definition: "",
    links: null,
    slug: "margin-of-error"
  },
  { term: "migrant", definition: "", links: null, slug: "migrant" },
  {
    term: "multi-stage sampling",
    definition:
      "The sample is drawn in two or more stages for example: selection of settlements at the first stage and a selection of households within settlement at the second stage.",
    links: null,
    slug: "multi-stage-sampling"
  },
  {
    term: "non-probability-based sampling",
    definition:
      "<p>Is any sampling method based where some elements of the population have no chance of selection because the sampling strategy is based on decisions related to convenience, quotas or deliberate choice of elements of the population. In these cases, the probability of selection can't be determined. Because the selection of elements is non-random, non-probability-based sampling does not allow the estimation of sampling errors, and it is not possible to assume that biases cancel each other out. The ability of making inferences about the population is limited when using non-probability based sampling and the information generated needs to be treated carefully.<br />Some adaptations of non-probability-based sampling have been made to allow for limited inferences. An example of this is <a href='/#/respondent-driven-sampling'>Respondent-Driven Sampling</a>, (RDS);, that proposes ways of estimating weights to try to account for biases in when using snowball sampling.</p>",
    links: null,
    slug: "non-probability-based-sampling"
  },
  {
    term: "non-representative sample",
    definition: "",
    links: null,
    slug: "non-representative-sample"
  },
  {
    term: "population characteristics",
    definition: "",
    links: null,
    slug: "population-characteristics"
  },
  {
    term: "precision of an estimate",
    definition: "",
    links: null,
    slug: "precision-of-an-estimate"
  },
  {
    term: "primary sampling unit",
    definition: "",
    links: null,
    slug: "primary-sampling-unit"
  },
  {
    term: "probability-based sampling",
    definition:
      "<p>Is a process to select a sample in which every unit in the population has a chance (greater than zero) of being selected in the sample, and this probability can be accurately determined. The fact that the probability can be established does not mean that it is always calculated. cThis makes it possible to produce unbiased estimates of population totals, by weighting sampled units according to their probability of selection.</p>",
    links: null,
    slug: "probability-based-sampling"
  },
  {
    term: "probability proportional to size (PPS)",
    definition:
      "Sample units are selected in proportion to their size giving a higher chance of selection to the larger sampling units. For example if we are sampling settlements, and the size of the settlement is given by the number of households,  if sampling of settlements is done with PPS, larger settlements would have higher probability of selection. For example if a settlement is double the size of another, it will have a probability of selection that is double than the other.",
    links: null,
    slug: "pps"
  },
  {
    term: "quasi-experiments",
    definition: "",
    links: null,
    slug: "quasi-experiments"
  },
  { term: "refugee", definition: "", links: null, slug: "refugee" },
  {
    term: "representative sample",
    definition: "",
    links: null,
    slug: "representative-sample"
  },
  {
    term: "respondent-driven Sampling",
    definition:
      "<p>Respondent-driven sampling (RDS), combines 'snowball sampling' (getting individuals to refer those they know, these individuals in turn refer those they know and so on) with a mathematical model that weights the sample to compensate for the fact that the sample was collected in a non-random way.</p><p>For more information visit:&nbsp;<a href='http://www.respondentdrivensampling.org/' target='_blank' rel='nofollow noopener'>http://www.respondentdrivensampling.org/</a></p>",
    links: null,
    slug: "respondent-driven-Sampling"
  },
  { term: "sample", definition: "", links: null, slug: "sample" },
  {
    term: "sampling frame",
    definition:
      "<p>A simple definition of a sampling frame is the set of source materials from which the sample is selected.  The definition also encompasses the purpose of sampling frames, which is to provide a means for choosing the particular members of the target population that are to be interviewed in the survey.<br><br>The two most important goals that a good sampling frame achieves are comprehensiveness and accuracy. Comprehensiveness refers to the degree to which a [Page 993]sampling frame covers the entire target population. Accuracy refers to the degree to which a sampling frame includes correct information about the elements of the target population it covers.</p>",
    links: null,
    slug: "sampling-frame"
  },
  { term: "sampling unit", definition: "", links: null, slug: "sampling-unit" }
];
