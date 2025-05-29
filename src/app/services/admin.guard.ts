import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('auth-token');
    const tipo = sessionStorage.getItem('tipoUsuario');

    // Só permite acesso se estiver logado e for ADMIN
    if (token && tipo === 'ADMIN') {
      return true;
    }

    // Se não for ADMIN, redireciona pro login
    this.router.navigate(['/login']);
    return false;
  }
}
