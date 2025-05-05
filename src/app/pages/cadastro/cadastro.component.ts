import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { InstituicaoService } from '../../services/instituicao.service';
import { LoginService } from '../../services/login.service';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { PrimaryInputComponent } from '../../components/primary-input/primary-input.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    PrimaryInputComponent
  ],
  providers: [LoginService]
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;
  categorias: string[] = [];
  disableBtn = false;
  primaryText = 'Cadastrar';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService,
    private instituicaoService: InstituicaoService
  ) {
    this.cadastroForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      cnpj: new FormControl('', Validators.required),
      nomeInstituicao: new FormControl('', Validators.required),
      categoria: new FormControl<string | null>(null, Validators.required),
      endereco: new FormControl('', Validators.required),
      telefone: new FormControl('', Validators.required),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmaSenha: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.instituicaoService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  submit(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();
      this.toastService.error('Preencha todos os campos corretamente!');
      return;
    }

    const {
      senha,
      confirmaSenha,
      nomeInstituicao,
      email,
      cnpj,
      endereco,
      telefone,
      categoria
    } = this.cadastroForm.value;

    if (senha !== confirmaSenha) {
      this.toastService.error('As senhas não coincidem!');
      return;
    }

    this.loginService.cadastro(
      nomeInstituicao!,
      email!,
      senha!,
      cnpj!,
      endereco!,
      telefone!,
      categoria!
    ).subscribe({
      next: () => {
        this.toastService.success('Cadastro realizado com sucesso!');
        setTimeout(() => this.router.navigate(['/login']), 1300);
      },
      error: (err) => {
        const mensagem = err.error?.mensagem || err.error?.message || 'Erro inesperado!';
        if (mensagem.includes('Email já cadastrado')) {
          this.toastService.error('Este e-mail já está em uso.');
        } else if (mensagem.includes('CNPJ já cadastrado')) {
          this.toastService.error('Este CNPJ já está cadastrado.');
        } else {
          this.toastService.error(mensagem);
        }
        this.resetBtn();
      },
      complete: () => this.resetBtn()
    });
  }

  resetBtn(): void {
    this.primaryText = 'Cadastrar';
    this.disableBtn = false;
  }

  navigate(): void {
    this.router.navigate(['/login']);
  }
}
