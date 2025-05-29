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
      const url = req.url;

      // Rotas com tratamento próprio de erro 400 no componente
      const rotasComErroTratado = ['/campanhas', '/lista', '/instituicoes'];

      const erroJaTratado = status === 400 && rotasComErroTratado.some(r => url.includes(r));
      if (erroJaTratado) {
        return throwError(() => error); // ignora toast duplicado
      }

      switch (status) {
        case 0:
          toastr.error('Erro de rede. Verifique sua conexão.');
          break;

        case 400:
          if (typeof error.error === 'string') {
            toastr.error(error.error);
          } else {
            toastr.warning('Requisição inválida.');
          }
          break;

        case 401:
          if (!url.includes('/login')) {
            toastr.error('Você precisa estar logado.', 'Erro 401');
            sessionStorage.clear();
            router.navigate(['/erro/401']);
          }
          break;

        case 403:
          toastr.warning('Você não tem permissão para acessar isso.', 'Erro 403');
          router.navigate(['/erro/403']);
          break;

        case 404:
          if (!url.includes('/recuperacao/solicitar')) {
            toastr.warning('Recurso não encontrado.');
            router.navigate(['/erro/404']);
          }
          break;

        case 429:
          toastr.warning(error.error || 'Você já fez uma solicitação recentemente.');
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
