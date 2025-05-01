import { LoginComponent } from "./pages/login/login.component";
import { CadastroComponent } from "./pages/cadastro/cadastro.component";
import { UserComponent } from "./pages/user/user.component";
import { AuthGuard } from "./services/auth-guard.service";
import { HomeComponent } from "./pages/home/home.component";
import { AlterarSenhaComponent } from "./pages/alterar-senha/alterar-senha.component";
import { Routes } from "@angular/router";
import {InstituicaoComponent} from "./pages/instituicao/instituicao.component";

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
    path: 'instituicao',
    component: InstituicaoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'alterar-senha',
    component: AlterarSenhaComponent,
    canActivate: [AuthGuard]
  }
];
