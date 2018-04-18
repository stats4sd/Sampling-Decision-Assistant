import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app.module';

// enable production mode when not serving locally
if (['localhost', '127'].indexOf(location.hostname) === -1) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
