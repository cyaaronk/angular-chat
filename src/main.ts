import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import * as environment from '../environment.json';

if (environment["mode"] == "production") {
  console.log("Running in Production mode.");
  enableProdMode();
}
else if (environment["mode"] == "development") console.log("Running in Development mode.");

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
