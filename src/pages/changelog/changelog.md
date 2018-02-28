# Changelog
In this document find recorded the main changes that have been implemented.

## 0.8.0 (27th February 2018)

Stage 5 - The logic for the most complex case scenarios (e.g. multiple stages with sampling and stratification at each stage) is up and ready for wider testing. This required a rewrite of how much of the data was handled to better track nested and linked variables, and provide easier creation of custom question interfaces. 

Stage 6 - First draft of a sampling tree diagram is now available, linking to the data from stage 5. This will be built on in the upcoming updates to allow for allocation of sample sizes throughout all stages.

Lots of bug fixes and minor style improvements (e.g. stage completion notifications for all stages, fewer double scroll bars, improvements for microsoft edge)

Background save and load - all changes are now immediately saved and a draft survey can be recovered and resumed if not properly saved  

## 0.7.2 (14th February 2018)

Stage 5 - further development of multi-stage building strategy (incomplete)

Drag/drop interactions - currently implemented for stage 5 q5.2

Background saving and resume of unsaved project

Lots of minor bug fixes and style improvements as well as general improvements to backend project layout and logic

## 0.7.1 (9th February 2018)

Stage 1 - minor changes

Stage 2 - now includes question on margins or error (2.4), questions related to proportions (2.1.2, 2.3.1), completion criteria, tweaks to text and interactions and resource key question placeholders.

## 0.7.0 (6th February 2018)

Help icons - now link to the resources section, and a couple of placeholder resources have been added to stage 1 to show how interactions might work. Resources are tagged to specific questions and open automatically when triggered from the help icon.

Completion status - new checkbox at the end of a section to track completion status and allow marking a section as complete. Reflects in animated button at the top of the page as well as the main step-by-step dashboard/landing page. Currently implemented just for stage 1

Stage 1 - Supporting text rewritten, minor changes to questions, expanded glossary

## 0.6.2 (1st February 2018)

Tree diagram visualisation component - integrated through the package vis.js, allows production of graphics such as tree diagrams and flow charts and will be used to help illustrate multi-stage sampling. Current placeholder illustrations available in sections 5 and 6

## 0.6.1 (22nd January 2018)

Further content development for stages 1-5, glossary restructuring

## 0.6.0 (20th January 2018)

Content development focused on stages 1 and 5. Warning/info messages and some codebase restructuring