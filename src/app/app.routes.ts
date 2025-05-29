// import { Routes } from "@angular/router";
//
// // 🔐 Guard
// import { AuthGuard } from "./services/auth-guard.service";
//
// // 📄 Páginas públicas
// import { HomeComponent } from "./pages/home/home.component";
// import { LoginComponent } from "./pages/login/login.component";
// import { CadastroComponent } from "./pages/cadastro/cadastro.component";
// import { RedefinirSenhaComponent } from "./pages/redefinir-senha/redefinir-senha.component";
// import {CampanhasPublicComponent} from "./pages/campanhas-public/campanhas-public.component";
//
// // 🔒 Páginas protegidas (usuário logado)
// import { UserComponent } from "./pages/user/user.component";
// import { InstituicaoComponent } from "./pages/instituicao/instituicao.component";
// import { AlterarSenhaComponent } from "./pages/alterar-senha/alterar-senha.component";
//
//
// // 🚫 Páginas de erro
// import { Pagina401Component } from "./pages/erros/pagina-401/pagina-401.component";
// import { Pagina403Component } from "./pages/erros/pagina-403/pagina-403.component";
// import { Pagina500Component } from "./pages/erros/pagina-500/pagina-500.component";
// import { Pagina404Component } from "./pages/erros/pagina-404/pagina-404.component";
//
//
//
// export const routes: Routes = [
//
//   // 🔁 Redirecionamento raiz
//   {
//     path: '',
//     redirectTo: 'home',
//     pathMatch: 'full'
//   },
//
//   // 🌐 Rotas públicas
//   { path: 'home', component: HomeComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'cadastro', component: CadastroComponent },
//   { path: 'redefinir-senha', component: RedefinirSenhaComponent },
//   {
//     path: 'recuperar-senha',
//     loadComponent: () => import('./pages/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent)
//   },
//
//   // 🔒 Rotas protegidas (usuário logado com AuthGuard)
//   {
//     path: 'user',
//     component: UserComponent,
//     canActivate: [AuthGuard]
//   },
//   {
//     path: 'campanhas',
//     loadComponent: () =>
//       import('./pages/campanha-instituicao/campanha-instituicao.component').then(m => m.CampanhaInstituicaoComponent),
//     canActivate: [AuthGuard]
//   },
//   {
//     path: 'instituicao',
//     component: InstituicaoComponent,
//     canActivate: [AuthGuard]
//   },
//   {
//     path: 'alterar-senha',
//     component: AlterarSenhaComponent,
//     canActivate: [AuthGuard]
//   },
//
//
//   // 🌐 Rotas públicas com dados dinâmicos
//   {
//     path: 'instituicoes/:id',
//     loadComponent: () =>
//       import('./pages/detalhes-instituicao/detalhes-instituicao.component').then(m => m.DetalhesInstituicaoComponent)
//   },
//   {
//     path: 'explorar',
//     loadComponent: () =>
//       import('./pages/instituicoes-public/instituicoes-public.component').then(m => m.InstituicoesPublicComponent)
//   },
//   {
//     path: 'explorar/campanhas',
//     component: CampanhasPublicComponent
//   },
//
//   // 🚫 Rotas de erro
//   { path: 'erro/401', component: Pagina401Component },
//   { path: 'erro/403', component: Pagina403Component },
//   { path: 'erro/500', component: Pagina500Component },
//   { path: '**', component: Pagina404Component } // rota wildcard
// ];
import { Routes } from "@angular/router";

// 🔐 Guard
import { AuthGuard } from "./services/auth-guard.service";

// 📄 Páginas públicas
import { HomeComponent } from "./pages/home/home.component";
import { LoginComponent } from "./pages/login/login.component";
import { CadastroComponent } from "./pages/cadastro/cadastro.component";
import { RedefinirSenhaComponent } from "./pages/redefinir-senha/redefinir-senha.component";
import { CampanhasPublicComponent } from "./pages/campanhas-public/campanhas-public.component";

// 🔒 Páginas protegidas (usuário logado)
import { UserComponent } from "./pages/user/user.component";
import { InstituicaoComponent } from "./pages/instituicao/instituicao.component";
import { AlterarSenhaComponent } from "./pages/alterar-senha/alterar-senha.component";

// 🚫 Páginas de erro
import { Pagina401Component } from "./pages/erros/pagina-401/pagina-401.component";
import { Pagina403Component } from "./pages/erros/pagina-403/pagina-403.component";
import { Pagina500Component } from "./pages/erros/pagina-500/pagina-500.component";
import { Pagina404Component } from "./pages/erros/pagina-404/pagina-404.component";
import {AdminGuard} from "./services/admin.guard";

export const routes: Routes = [
  // 🔁 Redirecionamento raiz
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  // 🌐 Rotas públicas
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'redefinir-senha', component: RedefinirSenhaComponent },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
      import('./pages/recuperar-senha/recuperar-senha.component').then(m => m.RecuperarSenhaComponent)
  },

  // 🔒 Rotas protegidas (usuário logado com AuthGuard)
  {
    path: 'user',
    component: UserComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'campanhas',
    loadComponent: () =>
      import('./pages/campanha-instituicao/campanha-instituicao.component').then(m => m.CampanhaInstituicaoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'instituicao',
    component: InstituicaoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'alterar-senha',
    component: AlterarSenhaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin/instituicoes',
    loadComponent: () => import('./pages/admin-instituicoes/admin-instituicoes.component').then(m => m.AdminInstituicoesComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/editar/:id',
    loadComponent: () => import('./pages/admin-editar/admin-editar.component').then(m => m.AdminEditarComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/instituicao/:id/listas',
    loadComponent: () => import('./pages/admin-lista/admin-lista.component').then(m => m.AdminListaComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/instituicao/:id/campanhas',
    loadComponent: () => import('./pages/admin-campanhas/admin-campanhas.component').then(m => m.AdminCampanhasComponent),
    canActivate: [AdminGuard]
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [AdminGuard]
  },


  // 🌐 Rotas públicas com dados dinâmicos
  {
    path: 'instituicoes/:id',
    loadComponent: () =>
      import('./pages/detalhes-instituicao/detalhes-instituicao.component').then(m => m.DetalhesInstituicaoComponent)
  },
  {
    path: 'explorar',
    loadComponent: () =>
      import('./pages/instituicoes-public/instituicoes-public.component').then(m => m.InstituicoesPublicComponent)
  },
  {
    path: 'explorar/campanhas',
    component: CampanhasPublicComponent
  },
  {
    path: 'campanhas/:id',
    loadComponent: () =>
      import('./pages/detalhes-campanha/detalhes-campanha.component').then(m => m.DetalhesCampanhaComponent)
  },
  {
    path: 'quem-somos',
    loadComponent: () => import('./pages/quem-somos/quem-somos.component').then(m => m.QuemSomosComponent)
  },
  {
    path: 'como-funciona',
    loadComponent: () => import('./pages/como-funciona/como-funciona.component').then(m => m.ComoFuncionaComponent)
  },
  { path: 'politica-privacidade',
    loadComponent: () => import('./pages/politica-privacidade/politica-privacidade.component').then(m => m.PoliticaPrivacidadeComponent)
  },


  // 🚫 Rotas de erro
  { path: 'erro/401', component: Pagina401Component },
  { path: 'erro/403', component: Pagina403Component },
  { path: 'erro/500', component: Pagina500Component },
  { path: '**', component: Pagina404Component } // rota wildcard
];
