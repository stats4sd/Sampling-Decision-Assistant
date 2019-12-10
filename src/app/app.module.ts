// core
import { NgModule } from "@angular/core";
import { MyApp } from "./app.component";
// animations
import { AnimatorModule } from "css-animator";
// platform and providers
// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from "@ionic/storage";
// menu
import { DecisionToolMenuComponent } from "../components/general/decision-tool-menu/decision-tool-menu";
// redux

// dev db
import { AngularFireModule } from "@angular/fire";
import { firebaseConfig } from "../components/_dev/config";
import { AngularFirestoreModule } from "@angular/fire/firestore";

@NgModule({
  declarations: [MyApp, DecisionToolMenuComponent],
  imports: [
    IonicStorageModule.forRoot({
      name: "__sampling"
    }),
    AnimatorModule,
    AngularFireModule.initializeApp(firebaseConfig.firebase, "v1"),
    AngularFirestoreModule.enablePersistence()
  ],
  entryComponents: [MyApp, DecisionToolMenuComponent],
  providers: []
})
export class AppModule {}
