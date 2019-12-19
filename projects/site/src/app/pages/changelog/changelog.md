# Changelog

In this document find recorded the main changes that have been implemented.

## 0.9.10 (10th May 2018)

      Review
      The review page now displays a summary of questions from all of the individual sections. All standard questions can
      be directly edited, however the specific reporting level classifications and sampling stage builder questions require
      the user to go back to the corresponding section in the app.


      Exports and Imports
       Three methods have been generated to work with exported data from the review section:


      Project Data: This is a text document which can then be shared with others and imported into the calculator through the load
      project screen

      XLS Summary: This contains a breakdown of questions answered and information calculated for the project for more general
      use

      <ion-icon style="margin-right:5px" src="assets/img/icons/tree.svg"></ion-icon>
      Tree Diagram: This is a seperate image containing the generated tree diagram (currently sized at the same size viewed in
      the browser, but in the future this will be scaled up)


      More Resource Videos
      An additional 6 videos have been created to support resource help elements in the first stage. You can view the rest individually the resource section, or together on <a target="_blank" nofollow href="https://www.youtube.com/watch?v=akco-dy3dSA&list=PLK5PktXR1tmOEvcWo1XQ79dYrnQGQlaNO">Youtube.</a>

    In addition, audio resources now display with text if the user would like to both listen and read along.

  </div>

  <!-- 0.9.9 -->
  <div>
    ## 0.9.9 (9th May 2018)</h2>
    
      More backend improvements, code tidying and refactoring. Work towards improved import/export functionality (coming soon)
    
  </div>

## 0.9.8 (8th May 2018)

    Codebase Upgrade
    The core codebase received an upgrade to latest versions released as of May 2018. This aims to improve performance,
    security and future maintenance

    Dramatic Performance Improvements
    Alongside the codebase upgrade, the existing code has been optimised to be smaller, load faster, and load 'lazily' in the background.
    This should see a dramatic improvement in the time taken for initial loading and navigation.

    Offline-ready
    The webapp now works offline! All files used are now cached locally so that the site will still function if internet
    connectivity is lost. When there are updates to the app these are downloaded silently in the background, and a notification
    message is presented to request the user reloads the web page to see the latest version.

    Stage 6 - Sample sizes can now be allocated at each stage. This has been through a few iterations and there are still some planned improvements, but for now
    it will be able to track individual allocation across changing sampling requirements and help to provide a visual overview (future update will also include a table with totals)

  </div>

## 0.9.7 (29th April 2018)

Stage 6 - The R-shiny calculator app has been rewritten entirely in javaScript so that it can be fully embedded into the app and even work offline. You can see it in action on the Stage 6 - Sample Sizes section. More work has also been done to link nodes in the tree diagram to the
rest of the app, for example when clicking on a node you can now see information relating to the sampling stage. In the next update there
should also be the finished implementation of allocating sample sizes at each stage.

Errors and Bug fixing - Ahead of the initial beta launch the app has undergone lots of additional tests with any bugs found prioritised for fixing. As it is however difficult to fully test every scenario that the allows for an additional service has been integrated that will automatically track any errors that a user may encounter, and automatically send a report on the error alongside key information to the developer, allowing easier tracking and fixing.

Save, Load and Project Delete - these have been fixed and should be working as expected. The option to load predefined example templates is yet to be implemented, as is the full xls export/import feature (coming soon!)

## 0.9.6 (26th April 2018)

Various bug fixes and putting more infrastructure in place for stage 6 (including a lightweight javascript-based stats package :D )

## 0.9.5 (24th April 2018)

User notes - You'll find more notes throughout the app, templates as:

```
    <note type="tip">Hints/Tips</note>
    <note type="clearTip">Subtle Hints/Tips</note>
    <note type="info">Information</note>
    <note type="warning">Warnings</note>
    <note type="error">Errors</note>
    <note type="dev">Features under construction</note>
```

Bug fixes - Lots more minor fixes and improvements, known issues have also been organised and prioritised into a rough set of milestones.

You can view the full list on github
"https://github.com/stats4sd/Sampling-Decision-Assistant/milestones?direction=asc&sort=due_date&state=open"

Performance and user flow improvements - Again, lots of incremental improvements to how the app runs, aiming for a smooth and consistent experience

## 0.9.4 (20th April 2018)

Glossary - lots of new terms have been added and can be seen from the main <a href="/#/glossary">glossary page</a>. In the next update lists of words that appear in each section will also be populated.

Videos - A new video for section 1 has been produced. You can see it here:
https://www.youtube.com/watch?v=akco-dy3dSA
<youtube-player videoId="akco-dy3dSA" width="450" height="300"></youtube-player>

Save/Load - This page no longer shows projects created from earlier versions. These can still be recovered on request and as of v1.0 it is expected that subsequent data structure changes should automatically upgrade.

Navigation - More changes have been added to the way the app handles transitions between different sections to make the overall experience smoother across mobile and web, and corresponding code more accessible. The main change you might see is some extra portions of the address bar indicating things like '?activeGlossary' for when a glossary term has been selected.
This is designed to make it easier to direct the user to a specific portion of the app, however may still change slightly in the future as the core platform has a proposed significant upgrade for issues relating to this.

Code refactoring - Numerous changes to make the codebase more user-friendly (mostly linked to a universal app 'state' (redux) which provides access to all relevant information currently being handled by the app)

Bug fixes and general improvements - various rounds of testing and fixing (11 issues closed, 15 new issues open)
https://github.com/stats4sd/Sampling-Decision-Assistant/issues

## 0.9.3 (11th April 2018)

Admin page (internal use) and glossary editor

## 0.9.2 (9th April 2018)

Stage 6 rebuild and fixes
Save/Load fixes

## 0.9.1 (5th April 2018)

Stage 5 rebuild and fixes
More editor features

## 0.9.0 (29th March 2018)

Various user interface and experience improvements including ability to automatically resume last project, background saving on every change so work shouldn't be lost, clearer question boxes, and optional range-slider style question (currently bugged in chrome). Option to rename Disaggregation and sampling stages, and better managing of other data associated with them. A number of other minor bug fixes.

A backend development live database link to allow content editors to directly make changes to the app (such as writing glossary definitions of Q&As). Once live this will most likely be removed.

A large rewrite of lots of the backend logic to better manage state changes. What this means in practice is:
a) The survey is now smart enough to not only manage what questions have/haven't been answered, but what is applicable/not.
This should come in useful for the final export so there are not lots of unnecessary n/a values.
b) It's easier to understand exactly where in the app the user is - the url currently shows the general section, but not
if the user is in the glossary, resources, or a subsection. Now it's easier to update selected portions of content based
on this distinction, as well as do things like open a given set of resources after the help button has been clicked.
c) Finding and fixing bugs is easier as a timeline of all changes is generated and can be carefully observed.
d) Much improved efficiency on dynamic questions - e.g. automatically calculating standard deviation. Before we had to watch
for changes to all question variables in the project as the specific min/max didn't yet exist. Now we can monitor the creation of new variables min/max and then attach an observer to respond when value changes.

## 0.8.2 (6th March 2018)

Stages with multiple steps now have breadcrumbs to help navigate where in the subprocess you are.

Stage 4 - Disaggregation are now classified during this stage (previously stage 5) and lists of combination are presented for review. In the future there may be an option for users to specify which levels of combination they consider relevant, however for now it should help to advise against the use of too many complex levels where not necessary.

Tree diagram now supports multiple Disaggregation in a single stage and automatically populates combinations of unallocated Disaggregation within the final sampling unit (orange boxes at the bottom level). It's also had a number of iterations of styling and display logic. (Next step will be to allow user input for nodes, an early template has been started in the resources -> allocating section however it's not functional yet).

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
