// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { InstituicaoService } from '../../services/instituicao.service';
// import { LoginService } from '../../services/login.service';
// import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
// import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
// import { debounceTime, distinctUntilChanged } from 'rxjs';
//
// @Component({
//   selector: 'app-cadastro',
//   standalone: true,
//   templateUrl: './cadastro.component.html',
//   styleUrl: './cadastro.component.scss',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     DefaultLoginLayoutComponent,
//     NgxMaskDirective
//   ],
//   providers: [LoginService, provideNgxMask()]
// })
// export class CadastroComponent implements OnInit {
//   cadastroForm!: FormGroup;
//   categorias: string[] = [];
//   ufs: string[] = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
//   disableBtn = false;
//   primaryText = 'Cadastrar';
//   mostrarModal = false;
//   mostrarEnderecoCompleto = false;
//   ultimoCnpjValidado: string = '';
//
//   constructor(
//     private router: Router,
//     private loginService: LoginService,
//     private toastService: ToastrService,
//     private instituicaoService: InstituicaoService,
//     private http: HttpClient
//   ) {
//     this.cadastroForm = new FormGroup({
//       email: new FormControl('', [Validators.required, Validators.email]),
//       cnpj: new FormControl('', Validators.required),
//       nomeInstituicao: new FormControl('', Validators.required),
//       categoria: new FormControl<string | null>(null, Validators.required),
//       endereco: new FormGroup({
//         cep: new FormControl('', Validators.required),
//         rua: new FormControl('', Validators.required),
//         numero: new FormControl('', Validators.required),
//         complemento: new FormControl(''),
//         bairro: new FormControl('', Validators.required),
//         cidade: new FormControl('', Validators.required),
//         uf: new FormControl('', Validators.required)
//       }),
//       telefone: new FormControl('', Validators.required),
//       senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
//       confirmaSenha: new FormControl('', Validators.required),
//       aceitouPolitica: new FormControl(false, Validators.requiredTrue)
//     });
//   }
//
//   ngOnInit(): void {
//     this.instituicaoService.getCategorias().subscribe(categorias => {
//       this.categorias = categorias;
//     });
//
//     // CEP: busca endereço automático
//     this.enderecoForm.get('cep')?.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((cep: string) => {
//       const cepLimpo = cep.replace(/\D/g, '');
//       if (cepLimpo.length === 8) this.buscarEnderecoPorCep();
//     });
//
//     // CNPJ: valida ao digitar (com debounce e sem repetir chamadas)
//     this.cadastroForm.get('cnpj')?.valueChanges.pipe(debounceTime(600), distinctUntilChanged()).subscribe((cnpj: string) => {
//       const cnpjLimpo = cnpj.replace(/\D/g, '');
//       if (cnpjLimpo.length !== 14 || cnpjLimpo === this.ultimoCnpjValidado) return;
//
//       this.ultimoCnpjValidado = cnpjLimpo;
//
//       this.toastService.info('Validando CNPJ...');
//
//       this.http.post('http://localhost:8080/instituicoes/validar-cnpj', { cnpj: cnpjLimpo }).subscribe({
//         next: () => this.toastService.success('CNPJ válido!'),
//         error: err => {
//           const mensagem = err.error?.mensagem || 'Erro ao validar CNPJ';
//           this.toastService.error(mensagem);
//         }
//       });
//     });
//   }
//
//   abrirModal(): void {
//     this.mostrarModal = true;
//   }
//
//   fecharModal(): void {
//     this.mostrarModal = false;
//   }
//
//   buscarEnderecoPorCep(): void {
//     const cep = this.enderecoForm.get('cep')?.value?.replace(/\D/g, '');
//     if (!cep || cep.length !== 8) return;
//
//     this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
//       next: res => {
//         if (res.erro) {
//           this.toastService.error('CEP inválido ou não encontrado.');
//           return;
//         }
//         this.enderecoForm.patchValue({
//           rua: res.logradouro,
//           bairro: res.bairro,
//           cidade: res.localidade,
//           uf: res.uf
//         });
//         this.mostrarEnderecoCompleto = true;
//       },
//       error: () => this.toastService.error('Erro ao buscar o CEP.')
//     });
//   }
//
//   submit(): void {
//     if (this.cadastroForm.invalid) {
//       this.cadastroForm.markAllAsTouched();
//
//       if (!this.cadastroForm.get('aceitouPolitica')?.value) {
//         this.toastService.error('Você deve aceitar a política de privacidade.');
//       } else {
//         this.toastService.error('Preencha todos os campos corretamente!');
//       }
//       return;
//     }
//
//     const {
//       senha, confirmaSenha, nomeInstituicao, email,
//       cnpj, endereco, telefone, categoria
//     } = this.cadastroForm.value;
//
//     if (senha !== confirmaSenha) {
//       this.toastService.error('As senhas não coincidem!');
//       return;
//     }
//
//     this.disableBtn = true;
//
//     this.loginService.cadastro(
//       nomeInstituicao, email, senha, cnpj, endereco, telefone, categoria
//     ).subscribe({
//       next: () => {
//         this.toastService.success('Cadastro realizado com sucesso!');
//         setTimeout(() => this.router.navigate(['/login']), 1300);
//       },
//       error: err => {
//         const mensagem = err.error?.mensagem || err.error?.message || 'Erro inesperado!';
//         this.toastService.error(mensagem);
//         this.resetBtn();
//       },
//       complete: () => this.resetBtn()
//     });
//   }
//
//   resetBtn(): void {
//     this.primaryText = 'Cadastrar';
//     this.disableBtn = false;
//   }
//
//   navigate(): void {
//     this.router.navigate(['/login']);
//   }
//
//   get enderecoForm(): FormGroup {
//     return this.cadastroForm.get('endereco') as FormGroup;
//   }
// }
//
//
// import { Component, OnInit } from '@angular/core';
// import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
// import { CommonModule } from '@angular/common';
// import { HttpClient } from '@angular/common/http';
// import { InstituicaoService } from '../../services/instituicao.service';
// import { LoginService } from '../../services/login.service';
// import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
// import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
// import { debounceTime, distinctUntilChanged } from 'rxjs';
//
// @Component({
//   selector: 'app-cadastro',
//   standalone: true,
//   templateUrl: './cadastro.component.html',
//   styleUrl: './cadastro.component.scss',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     DefaultLoginLayoutComponent,
//     NgxMaskDirective
//   ],
//   providers: [LoginService, provideNgxMask()]
// })
// export class CadastroComponent implements OnInit {
//   cadastroForm!: FormGroup;
//   categorias: string[] = [];
//   ufs: string[] = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
//   disableBtn = false;
//   primaryText = 'Cadastrar';
//   mostrarModal = false;
//   mostrarEnderecoCompleto = false;
//   ultimoCnpjValidado: string = ''; // para evitar múltiplas chamadas
//
//   constructor(
//     private router: Router,
//     private loginService: LoginService,
//     private toastService: ToastrService,
//     private instituicaoService: InstituicaoService,
//     private http: HttpClient
//   ) {
//     // Criação do formulário
//     this.cadastroForm = new FormGroup({
//       email: new FormControl('', [Validators.required, Validators.email]),
//       cnpj: new FormControl('', Validators.required),
//       nomeInstituicao: new FormControl('', Validators.required),
//       categoria: new FormControl<string | null>(null, Validators.required),
//       endereco: new FormGroup({
//         cep: new FormControl('', Validators.required),
//         rua: new FormControl('', Validators.required),
//         numero: new FormControl('', Validators.required),
//         complemento: new FormControl(''),
//         bairro: new FormControl('', Validators.required),
//         cidade: new FormControl('', Validators.required),
//         uf: new FormControl('', Validators.required)
//       }),
//       telefone: new FormControl('', Validators.required),
//       senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
//       confirmaSenha: new FormControl('', Validators.required),
//       aceitouPolitica: new FormControl(false, Validators.requiredTrue)
//     });
//   }
//
//   ngOnInit(): void {
//     // Carrega categorias do back-end
//     this.instituicaoService.getCategorias().subscribe(categorias => {
//       this.categorias = categorias;
//     });
//
//     // Busca automática de endereço via CEP com debounce
//     this.enderecoForm.get('cep')?.valueChanges.pipe(
//       debounceTime(300),
//       distinctUntilChanged()
//     ).subscribe((cep: string) => {
//       const cepLimpo = cep.replace(/\D/g, '');
//       if (cepLimpo.length === 8) this.buscarEnderecoPorCep();
//     });
//
//     // Validação automática do CNPJ ao digitar (com debounce e controle de duplicação)
//     this.cadastroForm.get('cnpj')?.valueChanges.pipe(
//       debounceTime(600),
//       distinctUntilChanged()
//     ).subscribe((cnpj: string) => {
//       const cnpjLimpo = cnpj.replace(/\D/g, '');
//
//       if (cnpjLimpo.length !== 14 || cnpjLimpo === this.ultimoCnpjValidado) return;
//
//       this.ultimoCnpjValidado = cnpjLimpo;
//
//       this.toastService.info('Validando CNPJ...');
//
//       this.http.post('http://localhost:8080/instituicoes/validar-cnpj', { cnpj: cnpjLimpo }).subscribe({
//         next: () => this.toastService.success('CNPJ válido!'),
//         error: err => {
//           const mensagem = err.error?.mensagem || 'Erro ao validar CNPJ';
//           this.toastService.error(mensagem);
//         }
//       });
//     });
//   }
//
//   abrirModal(): void {
//     this.mostrarModal = true;
//   }
//
//   fecharModal(): void {
//     this.mostrarModal = false;
//   }
//
//   buscarEnderecoPorCep(): void {
//     const cep = this.enderecoForm.get('cep')?.value?.replace(/\D/g, '');
//     if (!cep || cep.length !== 8) return;
//
//     this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
//       next: res => {
//         if (res.erro) {
//           this.toastService.error('CEP inválido ou não encontrado.');
//           return;
//         }
//         this.enderecoForm.patchValue({
//           rua: res.logradouro,
//           bairro: res.bairro,
//           cidade: res.localidade,
//           uf: res.uf
//         });
//         this.mostrarEnderecoCompleto = true;
//       },
//       error: () => this.toastService.error('Erro ao buscar o CEP.')
//     });
//   }
//
//   submit(): void {
//     if (this.cadastroForm.invalid) {
//       this.cadastroForm.markAllAsTouched();
//
//       if (!this.cadastroForm.get('aceitouPolitica')?.value) {
//         this.toastService.error('Você deve aceitar a política de privacidade.');
//       } else {
//         this.toastService.error('Preencha todos os campos corretamente!');
//       }
//       return;
//     }
//
//     const {
//       senha, confirmaSenha, nomeInstituicao, email,
//       cnpj, endereco, telefone, categoria
//     } = this.cadastroForm.value;
//
//     if (senha !== confirmaSenha) {
//       this.toastService.error('As senhas não coincidem!');
//       return;
//     }
//
//     this.disableBtn = true;
//
//     this.loginService.cadastro(
//       nomeInstituicao, email, senha, cnpj, endereco, telefone, categoria
//     ).subscribe({
//       next: () => {
//         this.toastService.success('Cadastro realizado com sucesso!');
//         setTimeout(() => this.router.navigate(['/login']), 1300);
//       },
//       error: err => {
//         const mensagem = err.error?.mensagem || err.error?.message || 'Erro inesperado!';
//         this.toastService.error(mensagem);
//         this.resetBtn();
//       },
//       complete: () => this.resetBtn()
//     });
//   }
//
//   resetBtn(): void {
//     this.primaryText = 'Cadastrar';
//     this.disableBtn = false;
//   }
//
//   navigate(): void {
//     this.router.navigate(['/login']);
//   }
//
//   // Getter para facilitar acesso ao form de endereço
//   get enderecoForm(): FormGroup {
//     return this.cadastroForm.get('endereco') as FormGroup;
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { InstituicaoService } from '../../services/instituicao.service';
import { LoginService } from '../../services/login.service';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DefaultLoginLayoutComponent,
    NgxMaskDirective
  ],
  providers: [LoginService, provideNgxMask()]
})
export class CadastroComponent implements OnInit {
  cadastroForm!: FormGroup;
  categorias: string[] = [];
  ufs: string[] = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];
  disableBtn = false;
  primaryText = 'Cadastrar';
  mostrarModal = false;
  mostrarEnderecoCompleto = false;
  ultimoCnpjValidado: string = '';

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService,
    private instituicaoService: InstituicaoService,
    private http: HttpClient
  ) {
    // Criação do formulário com validações
    this.cadastroForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      cnpj: new FormControl('', Validators.required),
      nomeInstituicao: new FormControl('', Validators.required),
      categoria: new FormControl<string | null>(null, Validators.required),
      endereco: new FormGroup({
        cep: new FormControl('', Validators.required),
        rua: new FormControl('', Validators.required),
        numero: new FormControl('', Validators.required),
        complemento: new FormControl(''),
        bairro: new FormControl('', Validators.required),
        cidade: new FormControl('', Validators.required),
        uf: new FormControl('', Validators.required)
      }),
      telefone: new FormControl('', Validators.required),
      senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmaSenha: new FormControl('', Validators.required),
      aceitouPolitica: new FormControl(false, Validators.requiredTrue)
    });
  }

  ngOnInit(): void {
    // Carrega categorias do back-end
    this.instituicaoService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });

    // Busca automática de endereço via CEP
    this.enderecoForm.get('cep')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((cep: string) => {
      const cepLimpo = cep.replace(/\D/g, '');
      if (cepLimpo.length === 8) this.buscarEnderecoPorCep();
    });

    // Validação automática do CNPJ com debounce
    this.cadastroForm.get('cnpj')?.valueChanges.pipe(
      debounceTime(600),
      distinctUntilChanged()
    ).subscribe((cnpj: string) => {
      const cnpjLimpo = cnpj.replace(/\D/g, '');

      if (cnpjLimpo.length !== 14 || cnpjLimpo === this.ultimoCnpjValidado) return;

      this.ultimoCnpjValidado = cnpjLimpo;

      this.toastService.info('Validando CNPJ...');

      this.instituicaoService.validarCnpj(cnpjLimpo).subscribe({
        next: () => this.toastService.success('CNPJ válido!'),
        error: err => {
          const mensagem = err.error?.mensagem || 'Erro ao validar CNPJ';
          this.toastService.error(mensagem);
        }
      });
    });
  }

  abrirModal(): void {
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  // Busca dados do endereço com base no CEP
  buscarEnderecoPorCep(): void {
    const cep = this.enderecoForm.get('cep')?.value?.replace(/\D/g, '');
    if (!cep || cep.length !== 8) return;

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: res => {
        if (res.erro) {
          this.toastService.error('CEP inválido ou não encontrado.');
          return;
        }
        this.enderecoForm.patchValue({
          rua: res.logradouro,
          bairro: res.bairro,
          cidade: res.localidade,
          uf: res.uf
        });
        this.mostrarEnderecoCompleto = true;
      },
      error: () => this.toastService.error('Erro ao buscar o CEP.')
    });
  }

  // Submissão do formulário
  submit(): void {
    if (this.cadastroForm.invalid) {
      this.cadastroForm.markAllAsTouched();

      if (!this.cadastroForm.get('aceitouPolitica')?.value) {
        this.toastService.error('Você deve aceitar a política de privacidade.');
      } else {
        this.toastService.error('Preencha todos os campos corretamente!');
      }
      return;
    }

    const {
      senha, confirmaSenha, nomeInstituicao, email,
      cnpj, endereco, telefone, categoria
    } = this.cadastroForm.value;

    if (senha !== confirmaSenha) {
      this.toastService.error('As senhas não coincidem!');
      return;
    }

    const cnpjLimpo = cnpj.replace(/\D/g, '');
    if (cnpjLimpo !== this.ultimoCnpjValidado) {
      this.toastService.error('CNPJ alterado após a validação. Aguarde nova validação antes de prosseguir.');
      return;
    }

    this.disableBtn = true;

    this.loginService.cadastro(
      nomeInstituicao, email, senha, cnpj, endereco, telefone, categoria
    ).subscribe({
      next: () => {
        this.toastService.success('Cadastro realizado com sucesso!');
        setTimeout(() => this.router.navigate(['/login']), 1300);
      },
      error: err => {
        const mensagem = err.error?.mensagem || err.error?.message || 'Erro inesperado!';
        this.toastService.error(mensagem);
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

  // Getter para facilitar acesso ao form de endereço
  get enderecoForm(): FormGroup {
    return this.cadastroForm.get('endereco') as FormGroup;
  }
}
