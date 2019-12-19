import * as Sentry from "@sentry/browser";
import { Injectable, ErrorHandler } from "@angular/core";
import { AppState } from "../../models/models";
import { NgRedux } from "@angular-redux/store";

Sentry.init({
  dsn: "https://e0a8fd91c39e48ba94a465900e4ab2da@sentry.io/1198240"
});

@Injectable({
  providedIn: "root"
})
export class SentryErrorHandler extends ErrorHandler {
  constructor(private ngRedux: NgRedux<AppState>) {
    super();
  }

  handleError(error) {
    // if serving locally, use ionic handler
    if (location.hostname.includes("localhost")) {
      super.handleError(error);
    }
    // // otherwise push to remote sentry logger
    else {
      Sentry.captureException(error.originalError || error);
    }
  }
}
