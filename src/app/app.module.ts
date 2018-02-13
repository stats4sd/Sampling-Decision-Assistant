import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AnimatorModule } from 'css-animator';
import { IonicStorageModule } from '@ionic/storage';
import { DataProvider } from '../providers/data/data';
import { FormProvider } from '../providers/form/form';

import { DecisionToolMenuComponent } from '../components/general/decision-tool-menu/decision-tool-menu'

@NgModule({
  declarations: [
    MyApp,
    DecisionToolMenuComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,
      // {
      //locationStrategy: 'path'
      // }, 
      // {
      // links: [
      //   { component: HomePage, name: 'Home', segment: 'home' },
      //   { component: 'GlossaryPage', name: 'Glossary', segment: 'glossary/:termID' }
      // ]
      // }
    ),
    IonicStorageModule.forRoot({
      name: '__sampling',
    }),
    AnimatorModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    DecisionToolMenuComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataProvider,
    FormProvider,
  ]
})
export class AppModule { }
