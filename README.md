# Sampling Decision Assistant

**This tool is actively under development and not intended for general use (yet!)**

## Setup

Use either nmp or yarn to install dependencies  
`yarn install` or `npm install`

### Serving locally

`npm run start`

### Deploying remotely

The project is linked to a remote firebase server for deployment.
The master github branch is linked to TravisCI and will automatically deploy the master branch on commit.

## Build notes

Custom build scripts in place to allow for automatic population of service worker assets and enable production build.
Build with:
`npm run build:prod`
This will also start the firebase server on port 5000 to check for errors

### Updating changelog

`pages/changelog/version.ts` -> version number and date
`pages/changelog/changelog.md` -> changelog markdown
`pages/changelog/changelog.html` -> rendered html of changelog (currently manually generated)

### Vis.JS

External package vis.js is used for tree diagrams. Due to hammer.js conflicts it is not imported from npm and instead sits in the /assets/js folder. To update to latest version download and place in the folder.

### ngx-image-viewer

Currently only installed to show images from roadmap. Can remove alongside font awesome if not required in future.
(font awesome loaded from index.html with files in assets/js/fontawesome)

## Docs

Docs are generated using compodoc https://compodoc.github.io
build: `npm run doc:build`
serve: `npm run doc:serve`
build and serve: `npm run doc:buildandserve`
Served docs available at http://localhost:8080

### Service worker

Service worker (with workbox)
https://golb.hplar.ch/2017/11/Ionic-with-Workbox-Service-Worker.html
https://golb.hplar.ch/2017/12/Workbox-in-Ionic-and-Lazy-Loading-Modules.html
https://developers.google.com/web/tools/workbox/guides/get-started

### Custom icons

https://golb.hplar.ch/2018/01/Custom-SVG-icons-in-Ionic.html
Additional icons imported individually (could be converted into auto script, but for now there aren't many)
SVG icons can be found at https://icomoon.io/app or https://www.flaticon.com/
Icons placed in assets/img/icons folder and imported in app.scss

### Workspace suggestions

Editor: VSCode
Extensions: angular2-inline
