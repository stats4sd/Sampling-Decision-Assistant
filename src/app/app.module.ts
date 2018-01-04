import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AnimatorModule } from 'css-animator';
import { IonicStorageModule } from '@ionic/storage';
import { DataProvider } from '../providers/data/data';
import { FormProvider } from '../providers/form/form';

import {DecisionToolMenuComponent} from '../components/decision-tool-menu/decision-tool-menu'

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    DecisionToolMenuComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '__sampling',
    }),
    AnimatorModule,
    BrowserAnimationsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    DecisionToolMenuComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    FormProvider
  ]
})
export class AppModule {}
