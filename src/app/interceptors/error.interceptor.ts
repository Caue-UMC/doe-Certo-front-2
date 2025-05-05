import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
  HttpEvent
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const toastr = inject(ToastrService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const status = error.status;

      switch (status) {
        case 0:
          toastr.error('Erro de rede. Verifique sua conexão.');
          break;

        case 400:
          if (
            typeof error.error !== 'string' ||
            !['Token inválido', 'Token inválido ou expirado'].includes(error.error)
          ) {
            toastr.warning(error.error || 'Requisição inválida.');
          }
          break;

        case 401:
          if (!req.url.includes('/login')) {
            toastr.error('Você precisa estar logado.', 'Erro 401');
            sessionStorage.clear();
            router.navigate(['/erro/401']);
          } else {
            toastr.error('Email ou senha incorretos.');
          }
          break;

        case 403:
          toastr.warning('Você não tem permissão para acessar isso.', 'Erro 403');
          router.navigate(['/erro/403']);
          break;

        case 404:
          if (req.url.includes('/recuperacao/solicitar')) {
            toastr.warning(error.error || 'Email não encontrado.');
          } else {
            toastr.warning('Recurso não encontrado.');
            router.navigate(['/erro/404']);
          }
          break;

        case 429:
          if (
            typeof error.error === 'string' &&
            error.error.includes('Já existe um link de redefinição')
          ) {
            toastr.warning('Você já solicitou redefinição. Verifique seu email.');
          } else {
            toastr.warning(error.error || 'Você já fez uma solicitação recentemente.');
          }
          break;

        case 500:
          toastr.error('Erro interno no servidor. Tente novamente mais tarde.', 'Erro 500');
          router.navigate(['/erro/500']);
          break;

        default:
          toastr.error(`Erro inesperado. Código: ${status}`);
          break;
      }

      console.error('Erro HTTP interceptado:', error);
      return throwError(() => error);
    })
  );
};
