export default {
    stage:4,
    questions: [
        {
            q: 'Can you explain the difference between studies that deal with estimation of population characteristics and studies to compare interventions? ',
            a: null,
            video: null,
            relevant: ['q4.1'],
        },
        {
            q: 'How exactly do I specify the different reporting levels that I will use for disaggregated estimates?',
            a: `
            <p>One method is to think about the different charts, graphs or reports you plan to produce as part of your final report.</p>
            <p>For example, say you planned to conduct your survey in 3 different locations, e.g. camps 'A','B' and 'C', then if you intended to possibly generate seperate reports for each camp then you should specify <strong>'Camp'</strong> as a level and <i>'A,B,C'</i> as the level classifications</p>.
            <br>Similarly, if within your report you intended to provide a comparison of results by gender then you should include <strong>'Gender'</strong> as a reporting level and suitable classifications such as <i>'Male, Female'</i>.
            `,
            video: '',
            relevant: ['reportingLevels'],
        },
    ],
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