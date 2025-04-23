import {LoginComponent} from "./pages/login/login.component";
import {CadastroComponent} from "./pages/cadastro/cadastro.component";
import {UserComponent} from "./pages/user/user.component";
import {AuthGuard} from "./services/auth-guard.service";
import {HomeComponent} from "./pages/home/home.component";
import {Routes} from "@angular/router";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'cadastro',
    component: CadastroComponent
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent
  }
];
