export default {
    stage: 1,
    questions: {
        Q1: {
            relevant: ['q1.1'],
            tags: ['estimation'],
            video: "Q1.mp4",
            audio: "Q1.mp3",
            q: "Can you explain the difference between studies that deal with estimation of population characteristics and studies to compare interventions?",
            a: `<p>In studies that deal with estimation of population characteristics, we are interested in finding out something about the population as it is. We do not intervene to change the conditions of any of the members of the population for the purposes of the study.</p>
        <p>In these cases we need to decide how to take samples from the population, and the aim of the design (that is the set of decisions that are made) is to &nbsp;estimate the value and variability of indicators of interest. Typical examples of this are the profiling exercises that are carried out on refugee or internally displaced populations. In these cases the design principles that apply are those related to sampling methods.</p>
        <p>Studies that compare interventions, intend to establish whether there are differences in the outcomes of one or more interventions. One could also say that the objective is to measure the extent to which any of the interventions perfoms better.</p>
        <p>For example, we may want to establish whether the amount of firewood consumed by refugee households is reduced when an improved model of cooker is introduced. In such case, we would deliberately change the type of cooker that some households use by introducing improved cookers (this will be our intervention), with the specific objective of comparing their fuel performance against that of traditional cookers. This leads to designs where each treatment is assigned to a subset of the households in such a manner that we maximise the ability of the study to compare cooker performance. This comparability is enhanced by controlling who and how a household receives a particular treatment. In these cases, the design principles that apply are those of experimental design.</p>
        <p>In practical field conditions we often end up designing quasi-experiments, that is experiments that are conducted under conditions when controlling all undesired influencing factors is not always possible. Quasi-experiments often use principles of experimental design and principles of sampling.</p>
        <p>This tool focuses on how to develop sampling designs to characterise populations.</p>
        <p>Some of its contents may be useful when designing quasi-experiments, but it is not optimised for that purpose. The tool is not intended to support the desgin of experiments.</p>`
        },
        Q2: {
            relevant: ['q1.1'],
            tags: ['estimation'],
            video: null,
            audio: "Q2.mp3",
            q: "Where are baseline versus end-line comparisons in this distinction?",
            a: `<p>Baselines and endlines require establishing the values of a set of indicators in a population at two particular points in time: baseline and endline. Often these characterisations require a process of sampling at each of those points. It makes sense to develop a good sampling design for a baseline so that efficient estimates are possible. Baseline and end-line designs should, whenever possible, have as similar sampling designs as possible so as to allow better comparisons.</p>
        <p>Sometimes endline and baseline comparisons also involve the study of intervention and control sites. In those cases, there are issues about how realistic the control or comparison sites may be, but if we can assume that the &ldquo;control subset&rdquo; of the population provides a good countrefactual, then a good sampling design would be of benefit to the characterisation of the intervened and control populations &ndash; both at baseline and endline. This tool is intended to help users design sampling processes that can be useful in those situations.</p>`
        },
        Q3: {
            relevant: ['q1.2'],
            tags: ['estimation'],
            video: null,
            audio: "Q3.mp3",
            q: "What is a representative sample?",
            a: `<p>It is a sample that can be used to make reliable statements about the whole population. That means that the process of selecting the sample must have safeguards that ensure that we are able to:</p>
        <ul>
        <li>Control and minimise potential biases</li>
        <li>Capture the variability of the population as well as possible</li>
        </ul>
        <p>To achieve this the sample needs to fulfil the following conditions:</p>
        <ul>
        <li>First: the sampling process must have a component of random selection, particularly at the level of the study units that are the centre of interest. For example, probability based sampling at the level of households if the main interest of the study has to do with indicators of food security at household level. A probability based sampling process is the best way to address issues of bias in the selection of a sample. By the way, many people use the expression: &ldquo;statistical sampling&rdquo; as a short hand for probability based sampling.</li>
        <li>Secondly: the sample size should be large enough to give us a good picture of the variability of the population. A sample of an appropriate size should be able to describe the variability of a population. The most common question asked when designing a sampling study is &ldquo;what sample size do I need?&rdquo;, this tool will help you gathering information that you need to get to a point where this question can begin to be answered. Please follow the steps suggested for designing your sampling process. You will soon get to the section about deciding the sample size.</li>
        </ul>
        <p>Strictly speaking we should talk about representative estimates rather than representative samples. That is, sample estimates that are unbiased and for which we can calculate margins of error. A sample that has the characteristics mentioned above would give the minimum conditions to get representative estimates. There is however one more thing that would be required in the estimation process. It should take into account weights that need to be attached to each observation in our sample. Whether we need to use weights in our estimation process and how those weights are derived, depends on how the sample has been drawn. This tool will help you keeping a record of the information that will be useful to inform how to carry out the estimation process and how to derive weights. We have also include a short introduction to weights, which can be found in the glosary.</p>`
        },
        Q4: {
            relevant: ['q1.2'],
            tags: ['estimation'],
            video: null,
            audio: "Q4.mp3",
            q: "When do I need to use weights: (video, not audio)",
            a: `<p>Inverse probability weighting</p>`
        },
        Q5: {
            relevant: ['q1.2'],
            tags: ['estimation'],
            video: null,
            audio: "Q5.mp3",
            q: "When do you need a representative sample?",
            a: `<p>A representative sample is needed when the results are going to be used to make statements about the overall population. In those cases, it is important to be able to say what is the value of estimate of interest and what is the margin of error in the estimation. Representative, probability based samples, allow the estimation of the characteristic of interest and to establish the margin of error.</p>
        <p>The contrast is with samples that cannot be said to be representative, and that provide information only about the elements that are included in the sample. In practice, the same arithmetic operations that are carried out on the data from a representative sample can be carried out using the data from a non-representative sample. The difference is in whether we can use the resulting estimate to make reliable inferences. The risk of making inferences from non-representative samples is that our estimates may be subject to unknown biases and we have no way to quatify the margins of error. The latter is due to the fact that statistical theory does not apply to non-representative samples. However, the use of non-representative samples is sometimes necessary when it is impossible to draw a representative sample. In those situations they are better than no information at all.</p>`
        },
        Q6: {
            relevant: ['q1.2'],
            tags: ['estimation'],
            video: null,
            audio: "Q6.mp3",
            q: "Are there any cases when we don’t need a representative sample?",
            a: `<p>One obvious case is when the population of interest is small and we are able to get information from each element of the population. In these cases a census is possible and it would be better, and probably not much more difficult or expensive, than a representative sample.</p>
        <p>In general a representative sample would be more desirable than a non-representative sample when the objective is to make inferences about the population. However in some cases it is not possible to go through the process of getting a representative sample and we need to use non-representative samples.</p>
        <p>For example: when the population of interest cannot be properly identified or found. This may happen when there is an intrinsic interest from the people in the study population to not be found. For example when they don&rsquo;t want to be found to avoid negative consequences such as imprisonment or deportation, or when the subject of interest is legally or morally considered undesirable.&nbsp; In these cases we may need to use ways to get to elements of the population of interest that are based on networks of contacts using methods like snow ball sampling or Respondent Driven Sampling, which attempts to improve the results from snow ball sampling using a mathematical model that weights the sample to compensate for the fact that we are using a non-representative sample.</p>
        <p>Some comon methods that yield non-representative samples are: accessibility sampling and quota sampling, but these would require strong justification before using them. Basically, this has to do with the fact that they may make life easier during the field operations, but the issues of bias and the impossibility to calculate margins of errors, are serious drawbacks.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>`
        },
        Q7: {
            relevant: ['q1.2'],
            tags: ['estimation'],
            video: null,
            audio: "Q7.mp3",
            q: "What are the limitations of results that come from a non-representative sample?",
            a: `<p>The main limitations are that it is difficult to ensure and demonstrate that the results are not biased and that there is no reliable way to estimate the margin of error of the estimates. Often people ignore this, and take results from non-representative samples with the same level of trust as if they came from representative samples. The problem is that such information carries an unknown level of risk, and may lead to ill informed decisions.</p>`
        },
        Q8: {
            relevant: ['q1.3'],
            tags: ['estimation'],
            video: null,
            audio: null,
            q: "Can you give me examples about how to best formulate the main objectives for the purposes of designing a sampling scheme?",
            a: `<p>When formulating objectives that will help in the process of design of a sampling scheme bare in mind that you need to be as specific as possible in relation to:</p>
        <ol>
        <li>Specifying the population of interest as well as you can&hellip;xxxx</li>
        <li>Specifying well enough the set of characteristics of interest</li>
        <li>Establishing the study units that are required.</li>
        <li>What else?</li>
        </ol>`
        },
    },

    QTemplate: {
        relevant: [''],
        tags: [''],
        video: null,
        audio: null,
        q: "",
        a: ``
    },

    examples: [
        {
            title: 'Profiling',
            context: 'For a profiling case we may wish to...',
            answers: [{ 'q1.1': 'answer 1' }, { 'q1.2': 'answer 2' }]
        },
        {
            title: 'Establishing a baseline',
            context: 'For a profiling case we may wish to...',
            answers: [{ 'q1.1': 'answer 1' }, { 'q1.2': 'answer 2' }]
        },
        {
            title: 'Establishing an end-line',
            context: 'For a profiling case we may wish to...',
            answers: [{ 'q1.1': 'answer 1' }, { 'q1.2': 'answer 2' }]
        }
    ],
    links: [

    ]
}
