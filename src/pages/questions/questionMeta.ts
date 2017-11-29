export default
    [
        { "isQuestion": "TRUE", "controlName": "q1.2", "type": "text", "selectOptions": "", "label": "How would you describe the main objective of this survey?", "section": "General objectives", "condition": "" },
        { "isQuestion": "TRUE", "controlName": "q1.3", "type": "text", "selectOptions": "", "label": "Are there any specific objectives?", "section": "General objectives", "condition": "" },
        { "isQuestion": "TRUE", "controlName": "q2.1", "type": "select", "selectOptions": "Yes, No", "label": "Can you identify an indicator that is of particular importance for this study and that could be used to provide us with key information for thinking about the sample size decisions.", "section": "Indicator", "condition": "" },
        { "isQuestion": "TRUE", "controlName": "q2.2", "type": "text", "selectOptions": "", "label": "What is the indicator?", "section": "Indicator", "condition": "type:value, controlName:q2.1, value:Yes" },
        { "isQuestion": "TRUE", "controlName": "q2.3", "type": "text", "selectOptions": "", "label": "What is the value that you would expect to find in the population – you may know it or may need to estimate it", "section": "Indicator", "condition": "type:value, controlName:q2.1, value:Yes" },
        { "isQuestion": "TRUE", "controlName": "q2.4", "type": "text", "selectOptions": "", "label": "What is the range of values that you expect to find for this indicator?", "section": "Indicator", "condition": "type:value, controlName:q2.1, value:Yes" },
        { "isQuestion": "TRUE", "controlName": "q2.5", "type": "text", "selectOptions": "", "label": "Do you have any idea about the size of the variance or the standard deviation for this indicator? This may have been published in recent reports, or could be guessed from similar reports, or perhaps be estimated from data available that is similar to the data you will be collecting", "section": "Indicator", "condition": "type:value, controlName:q2.1, value:Yes" },
        { "isQuestion": "TRUE", "controlName": "q2.6", "type": "number", "selectOptions": "", "label": "Think about the margin of error that you think is acceptable for the estimate that you are looking for? Please enter that range as a “plus or minus” in the units that are natural to the indicator.", "section": "Indicator", "condition": "type:value, controlName:q2.1, value:Yes" },
        { "isQuestion": "TRUE", "controlName": "q3.1", "type": "select", "selectOptions": "Individuals, Households, Groups of Individuals or households, Other (please specify)", "label": "Who are you interested in? In other words, who does the data should come from to be able to calculate the indicator of interest? We will refer to this as the ", "section": "Definition of the target population and units of study", "condition": "" },
        { "isQuestion": "FALSE", "controlName": "l3.1", "type": "label", "selectOptions": "", "label": "{{q1.2}}Are there any specific characteristics of those {{q3.1}} of interest {{q3.2}} that can be used to define them as a group of interest and distinguish them from others?  Please be as specific as you can", "section": "Definition of the target population and units of study", "condition": "" },
        { "isQuestion": "TRUE", "controlName": "q3.2", "type": "text", "selectOptions": "", "label": "With respect to location", "section": "Definition of the target population and units of study", "condition": "" },
        { "isQuestion": "TRUE", "controlName": "q3.3", "type": "text", "selectOptions": "", "label": "With respect to time (now, in a given period)", "section": "Definition of the target population and units of study", "condition": "" },
        { "isQuestion": "TRUE", "controlName": "q3.4", "type": "text", "selectOptions": "", "label": "Any other characteristics (ethnic group, origin, gender, reason for displacement, host population, IDP, refugees, etc)", "section": "Definition of the target population and units of study", "condition": "" },
        { "isQuestion": "FALSE", "controlName": "", "type": "feedback", "selectOptions": "", "label": "Presenting it back to the user and say:", "section": "Definition of the target population and units of study", "condition": "" },
        { "isQuestion": "FALSE", "controlName": "", "type": "feedback", "selectOptions": "", "label": "Message to user: Is this an accurate description of the population you are interested in. In responding to this question please ensure that it fully differentiates it from other populations. If you want to refine this definition, please edit the answers you provided.", "section": "Definition of the target population and units of study", "condition": "" },
        { "isQuestion": "TRUE", "controlName": "q4.1", "type": "select", "selectOptions": "Yes, No", "label": "We are only interested in one, single estimate for each indicator for the whole population (no need for disaggregation)", "section": "At what level do you need to report these results", "condition": "" },
        { "isQuestion": "TRUE", "controlName": "q4.2", "type": "multipleText", "selectOptions": "", "label": "Please specify the levels of disaggregation, be as specific in your replies", "section": "At what level do you need to report these results", "condition": "" }
    ]