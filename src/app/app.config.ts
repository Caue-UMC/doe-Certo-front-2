// import { ApplicationConfig } from '@angular/core';
// import { provideRouter } from '@angular/router';
//
// import { routes } from './app.routes';
// import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
// import {provideToastr} from "ngx-toastr";
// import {provideAnimations} from "@angular/platform-browser/animations";
// import {errorInterceptor} from "./interceptors/error.interceptor";
// import {provideNgxMask} from "ngx-mask";
// import {authInterceptor} from "./services/auth.interceptor";
//
// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideAnimations(),
//     provideToastr(),
//     provideNgxMask(),
//     provideHttpClient(withFetch(),
//     withInterceptors([authInterceptor,errorInterceptor]))
//   ]
// };
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNgxMask } from 'ngx-mask';
import { errorInterceptor } from './interceptors/error.interceptor';
import { authInterceptor } from './services/auth.interceptor'; // 👈 import novo

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideToastr(),
    provideNgxMask(),
    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor, errorInterceptor]) // 👈 token + tratamento de erro
    )
  ]
};
