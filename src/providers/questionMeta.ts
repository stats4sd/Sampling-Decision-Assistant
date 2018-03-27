export default
    [
        // Section 1
        {
            "isQuestion": "TRUE",
            "controlName": "q1.1",
            "type": "select",
            "selectOptions": "Estimating the value of one or a set of characteristics of a population, A comparison that needs a quasi-experimental or an experimental approach",
            "label": "How would you categorise the general purpose of your survey",
            "section": "General objectives",
            "condition": "",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q1.2",
            "type": "select",
            "selectOptions": "Representative, Non-representative",
            "label": "Do you need your sample to be representative, or is this not a requirement or even a possibility?",
            "section": "General objectives",
            "condition": "type:value, controlName:q1.1, value:Estimating the value of one or a set of characteristics of a population",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q1.3",
            "type": "text",
            "selectOptions": "",
            "label":
                "How would you describe the main objective of this survey?",
            "section": "General objectives",
            "condition": "type:value, controlName:q1.2, value:Representative",
            "labelMultiple": null
        },
        // Section 2
        {
            "isQuestion": "TRUE",
            "controlName": "q2.1.1",
            "type": "text",
            "selectOptions": "",
            "label": "What indicator do you want to choose to guide your sampling decisions?",
            "section": "Indicators",
            "condition": "",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q2.1.2",
            "type": "select",
            "selectOptions": "Average or total value of indicator in the population, Proportion of elements in the population with the characteristics of the indicator",
            "label": "Select the estimate that best describes your interest",
            "section": "Indicators",
            "condition": "",
            "labelMultiple": null
        },
        // case averages
        {
            "isQuestion": "TRUE",
            "controlName": "q2.2.1",
            "type": "select",
            "selectOptions": "Yes, No",
            "label": "Do you know what is the value of the standard deviation for the indicator in the population?",
            "section": "Indicators",
            "condition": "type:value, controlName:q2.1.2, value:Average or total value of indicator in the population",
            "labelMultiple": null
        },
        {

            "isQuestion": "TRUE",
            "controlName": "q2.2.2",
            "type": "number",
            "selectOptions": "",
            "label": "What is the value?",
            "section": "Indicators",
            "condition": "",
            "labelMultiple": null
        },
        {

            "isQuestion": "TRUE",
            "controlName": "q2.2.3",
            "type": "number",
            "selectOptions": "",
            "label": "What is the minimum value for the indicator that you can expect to find among the elements of the population?",
            "section": "Indicators",
            "condition": "type:value, controlName:q2.2.1, value:No",
            "labelMultiple": null
        },
        {

            "isQuestion": "TRUE",
            "controlName": "q2.2.4",
            "type": "number",
            "selectOptions": "",
            "label": "What is the maximum value for the indicator that you can expect to find among the elements of the population?",
            "section": "Indicators",
            "condition": "type:value, controlName:q2.2.1, value:No",
            "labelMultiple": null
        },
        // case proportions
        {

            "isQuestion": "TRUE",
            "controlName": "q2.3.1",
            "type": "range",
            "selectOptions": "",
            "label": "Roughly what value for this proportion do you expect to find with this survey? If you have no idea whatsoever set it as 0.5, otherwise provide your best estimate between 0 and 1.",
            "section": "Indicators",
            "condition": "type:value, controlName:q2.1.2, value:Proportion of elements in the population with the characteristics of the indicator",
            "labelMultiple": null,
            options:{
                max:95,
                min:5
            }
        },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q2.4",
        //     "type": "number",
        //     "selectOptions": "",
        //     "label": "What margin of error is acceptable in your estimation? Please use quantities and not percentages to answer this question.",
        //     "section": "Indicators",
        //     options:{
        //         prefix:'+/-',
        //     },
        //     "condition": "type:value, controlName:q2.1.2, value:Average or total value of indicator in the population",
        //     "labelMultiple": null
        // },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q2.4",
        //     "type": "number",
        //     "selectOptions": "",
        //     "label": "What margin of error is acceptable in your estimation? (Plus or minus how many percentage points?",
        //     "section": "Indicators",
        //     options:{
        //         prefix:'+/-',
        //     },
        //     "condition": "type:value, controlName:q2.1.2, value:Proportion of elements in the population with the characteristics of the indicator",
        //     "labelMultiple": null
        // },

        // section 3
        {
            "isQuestion": "TRUE", "controlName": "q3.1", "type": "select", "selectOptions": "Individuals, Households, Groups of Individuals or households, Other (please specify)", "label": "Who are you interested in? In other words, who should the data come from to be able to calculate the indicator of interest? We will refer to this as the sampling units. In particular, think about what unit the measurements refer to. Is it a household? Or a person? Or a community?", "section": "Definition of the target population and units of study", "condition": "", "labelMultiple": null
        },
        {
            "isQuestion": "TRUE", "controlName": "q3.2", "type": "text", "selectOptions": "", "label": "Geographical characteristics (e.g. area, setting, distance, composite)", "section": "Definition of the target population and units of study", "condition": "type:prerequisite, controlName:q3.1", "labelMultiple": null
        },

        {
            "isQuestion": "TRUE", "controlName": "q3.3", "type": "text", "selectOptions": "", "label": "Population group characteristics (e.g. affected, vulnerable, socio-economic, gender)", "section": "Definition of the target population and units of study", "condition": "type:prerequisite, controlName:q3.1", "labelMultiple": null
        },
        {
            "isQuestion": "TRUE", "controlName": "q3.4", "type": "text", "selectOptions": "", "label": "Characteristics with respect to time", "section": "Definition of the target population and units of study", "condition": "type:prerequisite, controlName:q3.1", "labelMultiple": null
        },
        {
            "isQuestion": "TRUE", "controlName": "q3.5", "type": "text", "selectOptions": "", "label": "Clearly define your target population, including any specific grouping characteristics such as location, time, ethnic group, origin, status etc.", "section": "Definition of the target population and units of study", "condition": "type:prerequisite, controlName:q3.1", "labelMultiple": null
        },
        {
            "isQuestion": "TRUE", "controlName": "q4.1", "type": "select", "selectOptions": "One estimate, Disaggregated estimates", "label": "Are you interested in producing one estimate, that is a headline value, for each indicator for the whole population, or do you need to disaggregate the estimates? For example by geographical area or by camp, etc.", "section": "At what level do you need to report these results", "condition": "", "labelMultiple": null
        },
        {
            "isQuestion": "TRUE", 
            "controlName": "q4.2", 
            "type": "textMultiple", 
            "selectOptions": "", 
            "label": "Specify the different levels that you wish to produce estimates for", 
            "section": "At what level do you need to report these results", "condition": "type:value, controlName:q4.1, value:Disaggregated estimates", "labelMultiple": "Name of level"
        },
        {
            "isQuestion": "TRUE", "controlName": "q4.3", "type": "text", "selectOptions": "", "label": "Provide a name or reference for the estimate", "section": "At what level do you need to report these results", "condition": "type:value, controlName:q4.1, value:One estimate"
        },
        // section 5
        {
            "isQuestion": "TRUE",
            "controlName": "q5.1",
            "type": "select",
            "selectOptions": "Yes, No",
            "label": "Is there a single list of all final sampling units from where you can select a sample using a random method?",
            "section": "Selecting the sampling units",
            "condition": "",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q5.1.1",
            "type": "select",
            "selectOptions": "Single-stage, Multi-stage",
            "label": "Would you prefer conduct your sampling in a single stage or in multiple stages",
            "section": "Selecting the sampling units",
            "condition": "type:value, controlName:q5.1, value:Yes",
            "labelMultiple": null,
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q5.2",
            "type": "custom-stages-define",
            "selectOptions": "",
            "label": "What are the sampling stages that will allow you to reach the final sampling unit?",
            "section": "Selecting the sampling units",
            "condition": "",
            options: {
                format: 'arrow',
                dragDrop:true
            }

        },
        // repeat group for each stage in multi-stage
        {
            "isQuestion": "TRUE",
            "controlName": "q5.3",
            "type": "repeat",
            "selectOptions": "q5.2",
            "label": "",
            "section": "Selecting the sampling units",
            "condition": "type:prerequisite, controlName:q5.2",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q5.3.1",
            "repeatGroup":"q5.3",
            "type": "select",
            "selectOptions": "Yes, No",
            "label": "Do you have a list of all sampling units in this stage?",
            "section": "Selecting the sampling units",
            "condition": "",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q5.3.2",
            "repeatGroup":"q5.3",
            "type": "select",
            "selectOptions": "Yes - proceed, No - highlight the disadvantages and suggest ways of updating it",
            "label": "Is the list as complete and up-to-date as possible?",
            "section": "Selecting the sampling units",
            "condition": "type:value, controlName:q5.3.1, value:Yes",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q5.3.3",
            "repeatGroup":"q5.3",
            "type": "select",
            "selectOptions": "Sample, All",
            "label": "Are you planning to take a sample from the list or are you planning to use all units in this stage?",
            "section": "Selecting the sampling units",
            "condition": "type:prerequisite, controlName:q5.3.1",
            "labelMultiple": null
        },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q5.3.3.1",
        //     "repeatGroup":"q5.3",
        //     "type": "number",
        //     "label": "How many units are there in the list? (If you are not sure make an estimate, this can be changed later)",
        //     "section": "Selecting the sampling units",
        //     "condition": "type:value, controlName:q5.3.3, value:All",
        //     "labelMultiple": null
        // },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q5.3.4.1",
        //     "repeatGroup":"q5.3",
        //     "type": "select",
        //     "selectOptions": "Yes, No",
        //     "label": "Do you want to use any stratification at this stage?",
        //     "section": "Selecting the sampling units",
        //     "condition": "type:value, controlName:q5.3.3, value:Sample",
        //     "labelMultiple": null
        // },
        {
            "isQuestion": "TRUE",
            "controlName": "q5.3.4.2",
            "repeatGroup":"q5.3",
            "type": "custom-strata-select",
            "selectOptions": "Yes, No",
            "label": "Can the stage be stratified by any of your reporting levels?",
            "section": "Selecting the sampling units",
            "condition": "type:prerequisite, controlName:q5.3.3",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q5.3.4.3",
            "repeatGroup":"q5.3",
            "type": "select",
            "selectOptions": "Simple random sampling, Probability proportional to size",
            "label": "<p>Are you planning to select the sampling units using<br><br>a. Simple Random Sampling, that is equal probability of selection for all the units. <br>b. Probability Proportional to Size, unequal probability of selection for different units ",
            "section": "Selecting the sampling units",
            "condition": "type:value, controlName:q5.3.3, value:Sample",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "strata",
            "type": "custom",
            "label": "Specify the individual strata you will us",
            "section": "Selecting the sampling units",
            "condition": "type:value, controlName:q5.3.4.1, value:Yes",
            "labelMultiple": null
        },
        {
            "isQuestion": "TRUE",
            "controlName": "q6.1",
            "type": "number",
            "label": "Input your required total sample size",
            "section": "Allocating and deploying resources",
            "condition": "",
            "labelMultiple": null
        },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q5.3.2",
        //     "type": "select",
        //     "selectOptions": "Yes, No",
        //     "label": "Can a list be obtained from elsewhere?",
        //     "section": "Selecting the sampling units",
        //     "condition": "type:value, controlName:q5.3.1, value:No",
        //     "labelMultiple": null
        // },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q5.3.3",
        //     "type": "select",
        //     "selectOptions":
        //         "Area based sampling, WASH clusters, Key informant lists, Community build frames\nArea based sampling",
        //     "label": "Are any of these options a sensible way forward to replace the sampling frame for the sampling units?",
        //     "section": "Selecting the sampling units",
        //     "condition": "type:value, controlName:q5.3.2, value:No",
        //     "labelMultiple": null
        // },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q5.3.4",
        //     "type": "select",
        //     "selectOptions": "Yes, No",
        //     "label": "Is this list (sampling frame) up-to-date?",
        //     "section": "Selecting the sampling units",
        //     "condition": "type:value, controlName:q5.3.1, value:Yes",
        //     "labelMultiple": null
        // },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q5.3.5",
        //     "type": "select",
        //     "selectOptions": "Yes, No",
        //     "label": "Are there any exclusions or omissions that you are aware of?",
        //     "section": "Selecting the sampling units",
        //     "condition": "type:value, controlName:q5.3.1, value:Yes",
        //     "labelMultiple": null
        // },
        // {
        //     "isQuestion": "TRUE",
        //     "controlName": "q5.3.6",
        //     "type": "text",
        //     "label": "If yes, what are the biases that may be introduced by it?",
        //     "section": "Selecting the sampling units",
        //     "condition": "type:value, controlName:q5.3.5, value:Yes",
        //     "labelMultiple": null
        // },
        // {

        //     "isQuestion": "FALSE",
        //     "controlName": "l5.4",
        //     "type": "label",
        //     "selectOptions": "",
        //     "label": "You said that the information needs to be disaggregated by {{q4.2}}. Consider whether the sampling units at this stage need to be separated into strata according to the reporting criteria",
        //     "section": "Selecting the sampling units",
        //     "condition": "type:value, controlName:q4.1, value:Disaggregated estimates",
        //     "labelMultiple": null
        // },
        // {
    ]