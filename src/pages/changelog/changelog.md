# Changelog
In this document find recorded the main changes that have been implemented.

## 0.9.2 (9th April 2018)
Stage 6 rebuild and fixes
Save/Load fixes

## 0.9.1 (5th April 2018)
Stage 5 rebuild and fixes
More editor features

## 0.9.0 (29th March 2018)

Various user interface and experience improvements including ability to automatically resume last project, background saving on every change so work shouldn't be lost, clearer question boxes, and optional range-slider style question (currently bugged in chrome). Option to rename reporting levels and sampling stages, and better managing of other data associated with them. A number of other minor bug fixes. 

A backend development live database link to allow content editors to directly make changes to the app (such as writing glossary definitions of Q&As). Once live this will most likely be removed. 

A large rewrite of lots of the backend logic to better manage state changes. What this means in practice is:
a)  The survey is now smart enough to not only manage what questions have/haven't been answered, but what is applicable/not.
    This should come in useful for the final export so there are not lots of unnecessary n/a values.
b)  It's easier to understand exactly where in the app the user is - the url currently shows the general section, but not
    if the user is in the glossary, resources, or a subsection. Now it's easier to update selected portions of content based
    on this distinction, as well as do things like open a given set of resources after the help button has been clicked.
c)  Finding and fixing bugs is easier as a timeline of all changes is generated and can be carefully observed.
d)  Much improved efficiency on dynamic questions - e.g. automatically calculating standard deviation. Before we had to watch
    for changes to all question variables in the project as the specific min/max didn't yet exist. Now we can monitor the creation of new variables min/max and then attach an observer to respond when value changes.    

## 0.8.2 (6th March 2018)

Stages with multiple steps now have breadcrumbs to help navigate where in the subprocess you are.

Stage 4 - Reporting levels are now classified during this stage (previously stage 5) and lists of combination are presented for review. In the future there may be an option for users to specify which levels of combination they consider relevant, however for now it should help to advise against the use of too many complex levels where not necessary. 

Tree diagram now supports multiple reporting levels in a single stage and automatically populates combinations of unallocated reporting levels within the final sampling unit (orange boxes at the bottom level). It's also had a number of iterations of styling and display logic. (Next step will be to allow user input for nodes, an early template has been started in the resources -> allocating section however it's not functional yet). 

## 0.8.1 (3rd March 2018)

Sample size calculator - A first pass have been given to write a calculator in R which is embedded into the app in stage 6. Currently the calculator requires the manual input of variables which are already present in the app, however in the future they will be better integrated.

Audio and Visual Resources - A new template has been included to display combinations of text, audio and visual resources, with a sample of resources available for stage 1
 

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