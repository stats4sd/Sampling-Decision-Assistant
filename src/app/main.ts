import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app.module';

// enable production mode when not serving locally
if (location.hostname.indexOf('localhost') == -1 || location.port=='5000') {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
