// import {DefaultLoginLayoutComponent} from "../../components/default-login-layout/default-login-layout.component";
// import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
// import {PrimaryInputComponent} from "../../components/primary-input/primary-input.component";
// import {Router} from "@angular/router";
// import {LoginService} from "../../services/login.service";
// import {ToastrService} from "ngx-toastr";
// import {Component, OnInit} from "@angular/core"; // 🔵 ATENÇÃO: adicionei OnInit
// import { CommonModule } from '@angular/common';
// import { InstituicaoService } from "../../services/instituicao.service";
//
// interface CadastroForm{
//   email: FormControl;
//   cnpj: FormControl;
//   nomeInstituicao: FormControl;
//   categoria: FormControl;
//   endereco: FormControl;
//   telefone: FormControl;
//   senha: FormControl;
//   confirmaSenha: FormControl;
// }
//
// @Component({
//   selector: 'app-cadastro',
//   standalone: true,
//   imports: [
//     DefaultLoginLayoutComponent,
//     ReactiveFormsModule,
//     PrimaryInputComponent,
//     CommonModule
//   ],
//   providers: [LoginService],
//   templateUrl: './cadastro.component.html',
//   styleUrl: './cadastro.component.scss'
// })
// export class CadastroComponent implements OnInit {  // 🔵 Agora implementa OnInit
//   cadastroForm!: FormGroup<CadastroForm>;
//   categorias: string[] = []; // 🔵 Adicionei variável
//
//   constructor(
//     private router: Router,
//     private loginService: LoginService,
//     private toastService: ToastrService,
//     private instituicaoService: InstituicaoService
//   ) {
//     this.cadastroForm = new FormGroup({
//       email: new FormControl('', [Validators.required]),
//       cnpj: new FormControl('', [Validators.required]),
//       nomeInstituicao: new FormControl('', [Validators.required]),
//       categoria: new FormControl('', [Validators.required]),
//       endereco: new FormControl('', [Validators.required]),
//       telefone: new FormControl('', [Validators.required]),
//       senha: new FormControl('', [Validators.required]),
//       confirmaSenha: new FormControl('', [Validators.required])
//     })
//   }
//
//   ngOnInit() {
//     this.instituicaoService.getCategorias().subscribe(categorias => {
//       this.categorias = categorias;
//     });
//   }
//
//   submit(){
//     this.loginService.cadastro(
//       this.cadastroForm.value.nomeInstituicao,
//       this.cadastroForm.value.email,
//       this.cadastroForm.value.senha,
//       this.cadastroForm.value.cnpj,
//       this.cadastroForm.value.endereco,
//       this.cadastroForm.value.telefone,
//       this.cadastroForm.value.categoria
//     ).subscribe({
//       next:() => this.toastService.success("Cadastro realizado com sucesso"),
//       error:() => this.toastService.error("Erro inesperado! Tente novamente mais tarde.")
//     })
//   }
//
//   navigate(){
//     this.router.navigate(["/login"])
//   }
// }
import { DefaultLoginLayoutComponent } from "../../components/default-login-layout/default-login-layout.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { PrimaryInputComponent } from "../../components/primary-input/primary-input.component";
import { Router } from "@angular/router";
import { LoginService } from "../../services/login.service";
import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import { CommonModule } from '@angular/common';
import { InstituicaoService } from "../../services/instituicao.service";

interface CadastroForm {
  email: FormControl;
  cnpj: FormControl;
  nomeInstituicao: FormControl;
  categoria: FormControl;
  endereco: FormControl;
  telefone: FormControl;
  senha: FormControl;
  confirmaSenha: FormControl;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    CommonModule
  ],
  providers: [LoginService],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup<CadastroForm>;
  categorias: string[] = [];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService,
    private instituicaoService: InstituicaoService
  ) {
    this.cadastroForm = new FormGroup({
      email: new FormControl('', [Validators.required]),
      cnpj: new FormControl('', [Validators.required]),
      nomeInstituicao: new FormControl('', [Validators.required]),
      categoria: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required]),
      telefone: new FormControl('', [Validators.required]),
      senha: new FormControl('', [Validators.required]),
      confirmaSenha: new FormControl('', [Validators.required])
    });
  }

  ngOnInit() {
    this.instituicaoService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });

    // 🔵 Mantém a checagem de senhas enquanto digita
    this.cadastroForm.valueChanges.subscribe(() => {
      this.senhasIguaisValidator(this.cadastroForm);
    });
  }

  submit() {
    const senha = this.cadastroForm.get('senha')?.value;
    const confirmaSenha = this.cadastroForm.get('confirmaSenha')?.value;

    // 🔵 Valida antes de tentar cadastrar
    if (senha !== confirmaSenha) {
      this.toastService.error("As senhas não coincidem!");
      return; // 🔵 Para tudo se estiver errado
    }

    // 🔵 Se senhas forem iguais, prossegue para cadastro
    this.loginService.cadastro(
      this.cadastroForm.value.nomeInstituicao,
      this.cadastroForm.value.email,
      this.cadastroForm.value.senha,
      this.cadastroForm.value.cnpj,
      this.cadastroForm.value.endereco,
      this.cadastroForm.value.telefone,
      this.cadastroForm.value.categoria
    ).subscribe({
      next: () => this.toastService.success("Cadastro realizado com sucesso"),
      error: () => this.toastService.error("Erro inesperado! Tente novamente mais tarde.")
    });
  }

  navigate() {
    this.router.navigate(["/login"]);
  }

  // 🔵 Validação personalizada para senha == confirmaSenha enquanto digita
  senhasIguaisValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmaSenha = form.get('confirmaSenha')?.value;

    if (senha !== confirmaSenha) {
      form.get('confirmaSenha')?.setErrors({ senhasDiferentes: true });
    } else {
      form.get('confirmaSenha')?.setErrors(null);
    }
  }
}

