# Sampling Decision Assistant

**This tool is actively under development and not intended for general use (yet!)**

## Setup
The project uses Ionic framework, install it via  
```npm install -g cordova ionic```  

Use either nmp or yarn to install dependencies  
`yarn install` or ` npm install`

### Serving locally
```ionic serve```

### Deploying remotely
The project is linked to a remote firebase server for deployment. Memebers of SSD with access can deploy via `firebase deploy`


## Build notes
### Updating changelog
`pages/changelog/version.ts` -> version number and date
`pages/changelog/changelog.md` -> changelog markdown
`pages/changelog/changelog.html` -> rendered html of changelog (currently manually generated)


Standard build with one current exception:
To enable text select within slide object the core ion-slides component has been changed. Ideally in future should fork and save as custom component however 
for now simply need to comment out mousedown listeners in `node_modules\ionic-angular\components\slides\swiper\swiper-events.js`

```
if ((s.simulateTouch && !plt.is('ios') && !plt.is('android')) || (s.simulateTouch && !s._supportTouch && plt.is('ios')) || plt.getQueryParam('ionicPlatform')) {
        // mousedown
        // plt.registerListener(touchEventsTarget, 'mousedown', function (ev) {
        //     onTouchStart(s, plt, ev);
        // }, { zone: false }, unregs);
        // // mousemove
        // plt.registerListener(touchEventsTarget, 'mousemove', function (ev) {
        //     onTouchMove(s, plt, ev);
        // }, { zone: false }, unregs);
        // // mouseup
        // plt.registerListener(touchEventsTarget, 'mouseup', function (ev) {
        //     onTouchEnd(s, plt, ev);
        // }, { zone: false }, unregs);
    }
```

### Vis.JS
External package vis.js is used for tree diagrams. Due to hammer.js conflicts it is not imported from npm and instead sits in the /assets/js folder. To update to latest version download and place in the folder.

### ngx-image-viewer
Currently only installed to show images from roadmap. Can remove alongside font awesome if not required in future.
(font awesome loaded from index.html with files in assets/js/fontawesome)

### viewing inline templates
Some components are defined in a single .ts file. If editing, to view the html with proper markup try an extension
such as https://github.com/Microsoft/typescript-lit-html-plugin for vscode

## Docs
Docs are generated using compodoc https://compodoc.github.io
build: `npm run doc:build`
serve: `npm run doc:serve`
build and serve: `npm run doc:buildandserve`
Served docs available at http://localhost:8080

###
Service worker (with workbox)
https://golb.hplar.ch/2017/11/Ionic-with-Workbox-Service-Worker.html
https://golb.hplar.ch/2017/12/Workbox-in-Ionic-and-Lazy-Loading-Modules.html
https://developers.google.com/web/tools/workbox/guides/get-started
