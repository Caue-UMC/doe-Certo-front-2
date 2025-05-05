import { LoginComponent } from "./pages/login/login.component";
import { CadastroComponent } from "./pages/cadastro/cadastro.component";
import { UserComponent } from "./pages/user/user.component";
import { AuthGuard } from "./services/auth-guard.service";
import { HomeComponent } from "./pages/home/home.component";
import { AlterarSenhaComponent } from "./pages/alterar-senha/alterar-senha.component";
import { Routes } from "@angular/router";
import {InstituicaoComponent} from "./pages/instituicao/instituicao.component";
import {Pagina401Component} from "./pages/erros/pagina-401/pagina-401.component";
import {Pagina403Component} from "./pages/erros/pagina-403/pagina-403.component";
import {Pagina500Component} from "./pages/erros/pagina-500/pagina-500.component";
import {Pagina404Component} from "./pages/erros/pagina-404/pagina-404.component";
import {RedefinirSenhaComponent} from "./pages/redefinir-senha/redefinir-senha.component";

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
  },
  {
    path: 'recuperar-senha',
    loadComponent: () => import('./pages/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent)
  },
  {
    path: 'redefinir-senha',
    component: RedefinirSenhaComponent
  },
  {
    path: 'erro/401',
    component: Pagina401Component
  },
  {
    path: 'erro/403',
    component: Pagina403Component
  },
  {
    path: 'erro/500',
    component: Pagina500Component
  },
  {
    path: '**',
    component: Pagina404Component
  }

];
