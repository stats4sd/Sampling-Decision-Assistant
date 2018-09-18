export default {
    stage: 0,
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
