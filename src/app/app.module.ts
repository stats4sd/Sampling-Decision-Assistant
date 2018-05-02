// core
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
// animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnimatorModule } from 'css-animator';
// platform and providers
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { DataProvider } from '../providers/data/data';
import { FormProvider } from '../providers/form/form';
// menu
import { DecisionToolMenuComponent } from '../components/general/decision-tool-menu/decision-tool-menu'
// redux
import { NgRedux, DevToolsExtension, NgReduxModule } from '@angular-redux/store';
import { AppState } from '../models/models';
import { rootReducer, INITIAL_STATE } from '../reducers/reducers';
import { ProjectActions, DevActions, ViewActions, TreeDiagramActions } from '../actions/actions';
// dev db
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from '../components/_dev/config';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { CustomRouterProvider } from '../providers/router/router';
import { SentryErrorHandler } from '../providers/error-handler/error-handler';

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
    NgReduxModule,
    AngularFireModule.initializeApp(firebaseConfig.firebase),
    AngularFirestoreModule.enablePersistence(),
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
    //{ provide: ErrorHandler, useClass: SentryErrorHandler },
    DataProvider,
    FormProvider,
    ProjectActions,
    DevActions,
    ViewActions,
    TreeDiagramActions,
    DevToolsExtension,
    CustomRouterProvider,
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
