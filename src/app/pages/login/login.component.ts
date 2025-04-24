import { Component } from '@angular/core';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';

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
    PrimaryInputComponent
  ],
  providers: [
    LoginService
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup<LoginForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ){
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      senha: new FormControl('', [Validators.required]) //Validators.minLength(6)])
    })
  }

  submit() {
    this.loginService.login(
      this.loginForm.value.email,
      this.loginForm.value.senha
    ).subscribe({

      next: (res: any) => {
        sessionStorage.setItem('auth-token', res.token);
        sessionStorage.setItem('id', res.id);
        sessionStorage.setItem('email', res.email);
        this.toastService.success("Login feito com sucesso!");
        this.router.navigate(['/user']);
      },

      // next: (res: any) => {
      //   sessionStorage.setItem('auth-token', res.token); // Salva o token na sessão
      //   sessionStorage.setItem('id', res.id); // Salva o id na sessao
      //   this.toastService.success("Login feito com sucesso!");
      //   this.router.navigate(['/user']);
      //
      // },

      error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde")
    });
  }


  navigate(){
    this.router.navigate(["cadastro"])
  }
}
