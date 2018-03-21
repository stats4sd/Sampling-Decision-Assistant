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
import { NgRedux, DevToolsExtension, NgReduxModule } from '@angular-redux/store';
import { AppState } from '../models/models';
import { rootReducer, INITIAL_STATE } from '../reducers/reducers';
import { ProjectActions } from '../actions/actions';

@NgModule({
  declarations: [
    MyApp,
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
    NgReduxModule
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
    ProjectActions,
    DevToolsExtension
  ]
})
export class AppModule { 
  // configure redux
  constructor(store: NgRedux<AppState>, devTools:DevToolsExtension) {
    store.configureStore(
      rootReducer, 
      INITIAL_STATE, 
      [],
      // [reduxLogger.createLogger()],
      devTools.isEnabled() ? [devTools.enhancer()] : []);
  }
}
