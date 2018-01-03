export default
[{"isQuestion":"TRUE","controlName":"q1.1","type":"text","selectOptions":"","label":"How would you describe the main objective of this survey?","section":"General objectives","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q1.2","type":"text","selectOptions":"","label":"Are there any specific objectives?","section":"General objectives","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q2.1","type":"select","selectOptions":"Yes, No","label":"Can you identify an indicator that is of particular importance for this study and that could be used to provide us with key information for thinking about the sample size decisions.","section":"Indicators","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q2.2","type":"text","selectOptions":"","label":"What is the indicator?","section":"Indicators","condition":"type:value, controlName:q2.1, value:Yes","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q2.3","type":"text","selectOptions":"","label":"What is the value that you would expect to find in the population – you may know it or may need to estimate it","section":"Indicators","condition":"type:value, controlName:q2.1, value:Yes","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q2.4","type":"text","selectOptions":"","label":"What is the range of values that you expect to find for this indicator?","section":"Indicators","condition":"type:value, controlName:q2.1, value:Yes","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q2.5","type":"select","selectOptions":"Yes, No","label":"Do you have any idea about the size of the variance or the standard deviation for this indicator? This may have been published in recent reports, or could be guessed from similar reports, or perhaps be estimated from data available that is similar to the data you will be collecting","section":"Indicators","condition":"type:value, controlName:q2.1, value:Yes","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q2.6","type":"text","selectOptions":"","label":"What is the value or range of values?","section":"Indicators","condition":"type:value, controlName:q2.5, value:Yes","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q2.6","type":"number","selectOptions":"","label":"<p>It is recommended that you try to find out more information about the variance from previous studies or somebody else who may know. If this is not possible then calculate as follows:</p> <p> take the difference between the minimum value and the maximum that came from 2.4, divided it by 5 and square the result.</p> This will yield a very rough estimate of the variance that assumes that the distribution is roughly symmetric around the mean value.","section":"Indicators","condition":"type:value, controlName:q2.5, value:No","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q2.7","type":"number","selectOptions":"","label":"Think about the margin of error that you think is acceptable for the estimate that you are looking for? Please enter that range as a “plus or minus” in the units that are natural to the indicator.","section":"Indicators","condition":"type:value, controlName:q2.1, value:Yes","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q3.1","type":"select","selectOptions":"Individuals, Households, Groups of Individuals or households, Other (please specify)","label":"Who are you interested in? In other words, who should the data come from to be able to calculate the indicator of interest? We will refer to this as the sampling units. In particular, think about what unit the measurements refer to. Is it a household? Or a person? Or a community?","section":"Definition of the target population and units of study","condition":"","labelMultiple":null},
{"isQuestion":"FALSE","controlName":"l3.2","type":"label","selectOptions":"","label":"Are there any specific characteristics of those {{q3.1}} of interest that can be used to define them as a group of interest and distinguish them from others?  Please be as specific as you can","section":"Definition of the target population and units of study","condition":"type:prerequisite, controlName:q3.1","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q3.2","type":"text","selectOptions":"","label":"With respect to location","section":"Definition of the target population and units of study","condition":"type:prerequisite, controlName:q3.1","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q3.3","type":"text","selectOptions":"","label":"With respect to time (now, in a given period)","section":"Definition of the target population and units of study","condition":"type:prerequisite, controlName:q3.1","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q3.4","type":"text","selectOptions":"","label":"Any other characteristics (ethnic group, origin, gender, reason for displacement, host population, IDP, refugees, etc)","section":"Definition of the target population and units of study","condition":"type:prerequisite, controlName:q3.1","labelMultiple":null},
{"isQuestion":"FALSE","controlName":"","type":"feedback","selectOptions":"","label":"Presenting it back to the user and say:","section":"Definition of the target population and units of study","condition":"","labelMultiple":null},
{"isQuestion":"FALSE","controlName":"","type":"feedback","selectOptions":"","label":"Message to user: Is this an accurate description of the population you are interested in. In responding to this question please ensure that it fully differentiates it from other populations. If you want to refine this definition, please edit the answers you provided.","section":"Definition of the target population and units of study","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q4.1","type":"select","selectOptions":"One estimate, Disaggregated estimates","label":"Are you interested in producing one estimate, that is a headline value, for each indicator for the whole population, or do you need to disaggregate the estimates? For example by geographical area or by camp, etc.","section":"At what level do you need to report these results","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q4.2","type":"textMultiple","selectOptions":"","label":"Please specify the levels of disaggregation, be as specific in your replies","section":"At what level do you need to report these results","condition":"type:value, controlName:q4.1, value:Disaggregated estimates","labelMultiple":"Name of level"},
{"isQuestion":"TRUE","controlName":"q5.1","type":"select","selectOptions":"Yes, No","label":"Is there a single list of all final sampling units from where you can select a sample using a random method?","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.2","type":"textMultiple","selectOptions":"","label":"What are the sampling stages that will allow you to reach the final sampling unit?","section":"Selecting and reaching units","condition":"type:value, controlName:q5.1, value:No","labelMultiple":"Sampling stages"},
{"isQuestion":"TRUE","controlName":"q5.3","type":"repeat","selectOptions":"q5.2","label":"","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.3.1","type":"select","selectOptions":"Yes, No","label":"Is there a single list of all sampling units at this stage from where you can select them?","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.3.2","type":"select","selectOptions":"Yes, No","label":"Can a list be obtained from elsewhere?","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.3.3","type":"select","selectOptions":"Area based sampling, WASH clusters, Key informant lists, Community build frames\nArea based sampling","label":"Is any of these options a sensible way forward to replace the sampling frame for the sampling units?","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.3.4","type":"select","selectOptions":"Yes, No","label":"Is this list (sampling frame) up-to-date?","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.3.5","type":"select","selectOptions":"Yes, No","label":"Are there any exclusions or omissions that you are aware of?","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.3.6","type":"select","selectOptions":"Yes, No","label":"if yes, what are the biases that may be introduced by it?","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"FALSE","controlName":"l5.4","type":"label","selectOptions":"","label":"You said that the information needs to be disaggregated by {{q4.2}}. Consider whether the sampling units at this stage need to be separated into strata according to the reporting criteria","section":"Selecting and reaching units","condition":"type:value, controlName:q4.1, value:Disaggregated estimates","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.4","type":"repeat","selectOptions":"q4.2","label":"Show the list of possible reporting levels to and for each allow the selection of the level as a criteria for stratification. Roguhtly as follows","section":"Selecting and reaching units","condition":"type:value, controlName:q4.1, value:Disaggregated estimates","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.4.1","type":"select","selectOptions":"Yes, No","label":"Level will be used as a stratification factor?","section":"Selecting and reaching units","condition":"","labelMultiple":null},
{"isQuestion":"TRUE","controlName":"q5.4.2","type":"select","selectOptions":"Yes, No","label":"Are there any groups of sampling units at this stage that should be grouped together to help in controlling variability?","section":"Selecting and reaching units","condition":"","labelMultiple":null}]