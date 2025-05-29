import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

interface LoginForm {
  email: FormControl,
  senha: FormControl
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ],
  providers: [LoginService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }
  submit() {
    if (this.loginForm.invalid) return;

    this.loginService.login(
      this.loginForm.value.email,
      this.loginForm.value.senha
    ).subscribe({
      next: (res: any) => {
        sessionStorage.setItem('auth-token', res.token);
        sessionStorage.setItem('id', res.id);
        sessionStorage.setItem('email', res.email);
        sessionStorage.setItem('tipoUsuario', res.tipoUsuario);

        if (res.tipoUsuario === 'ADMIN') {
          // 🔧 ESSENCIAL: Salva o objeto admin pra leitura no header
          sessionStorage.setItem('admin', JSON.stringify({
            nome: 'Administrador',
            email: res.email
          }));
        }

        if (res.instituicao) {
          sessionStorage.setItem('instituicao', JSON.stringify(res.instituicao));
        }

        this.toastService.success("Login feito com sucesso!");

        if (res.tipoUsuario === 'ADMIN') {
          this.router.navigate(['/admin/instituicoes']);
        } else {
          this.router.navigate(['/user']);
        }
      },
      error: () => {
        this.toastService.error("Email ou senha incorretos.");
      }
    });
  }

  // submit() {
  //   if (this.loginForm.invalid) return;
  //
  //   this.loginService.login(
  //     this.loginForm.value.email,
  //     this.loginForm.value.senha
  //   ).subscribe({
  //     next: (res: any) => {
  //       sessionStorage.setItem('auth-token', res.token);
  //       sessionStorage.setItem('id', res.id);
  //       sessionStorage.setItem('email', res.email);
  //       sessionStorage.setItem('tipoUsuario', res.tipoUsuario); // <<< Adicionado
  //
  //       if (res.instituicao) {
  //         sessionStorage.setItem('instituicao', JSON.stringify(res.instituicao));
  //       }
  //
  //       this.toastService.success("Login feito com sucesso!");
  //
  //       // Redirecionamento condicional
  //       if (res.tipoUsuario === 'ADMIN') {
  //         this.router.navigate(['/admin/instituicoes']);
  //       } else {
  //         this.router.navigate(['/user']);
  //       }
  //     },
  //     error: () => {
  //       this.toastService.error("Email ou senha incorretos.");
  //     }
  //   });
  // }

  navigate() {
    this.router.navigate(["cadastro"]);
  }
}
