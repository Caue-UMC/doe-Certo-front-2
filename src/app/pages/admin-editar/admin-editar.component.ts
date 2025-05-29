// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ActivatedRoute } from '@angular/router';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { ToastrService } from 'ngx-toastr';
// import { SidebarComponent } from '../../components/sidebar/sidebar.component';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
// import { debounceTime, distinctUntilChanged } from 'rxjs';
//
// @Component({
//   selector: 'app-admin-editar',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     SidebarComponent,
//     NgxMaskDirective
//   ],
//   providers: [provideNgxMask()],
//   templateUrl: './admin-editar.component.html',
//   styleUrls: ['./admin-editar.component.scss']
// })
// export class AdminEditarComponent implements OnInit {
//   form!: FormGroup;
//   id!: number;
//   imagemSelecionada: File | null = null;
//   imagemUrl: string = '';
//   estados: string[] = [
//     'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
//     'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
//     'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
//   ];
//   categorias: string[] = [];
//   cnpjOriginal: string = '';
//   emailOriginal: string = '';
//
//   mostrarModalSenha = false;
//   senhaConfirmacao: string = '';
//
//   constructor(
//     private fb: FormBuilder,
//     private route: ActivatedRoute,
//     private http: HttpClient,
//     private toastr: ToastrService
//   ) {}
//
//   ngOnInit(): void {
//     this.id = Number(this.route.snapshot.paramMap.get('id'));
//     this.inicializarFormulario();
//     this.carregarCategorias();
//     this.carregarInstituicao();
//
//     this.form.get('cnpj')?.valueChanges
//       .pipe(debounceTime(600), distinctUntilChanged())
//       .subscribe(cnpj => {
//         const cnpjLimpo = cnpj.replace(/\D/g, '');
//         if (cnpjLimpo.length === 14 && cnpjLimpo !== this.cnpjOriginal) {
//           this.validarCnpj(cnpjLimpo);
//         }
//       });
//
//     this.form.get('endereco.cep')?.valueChanges
//       .pipe(debounceTime(600), distinctUntilChanged())
//       .subscribe(cep => {
//         const cepLimpo = cep.replace(/\D/g, '');
//         if (cepLimpo.length === 8) {
//           this.buscarCep(cepLimpo);
//         }
//       });
//
//     this.form.get('email')?.valueChanges
//       .pipe(debounceTime(600), distinctUntilChanged())
//       .subscribe(email => {
//         if (email.length >= 6 && email !== this.emailOriginal) {
//           this.validarEmail(email);
//         }
//       });
//   }
//
//   inicializarFormulario(): void {
//     this.form = this.fb.group({
//       nomeInstituicao: ['', [Validators.required, Validators.minLength(3)]],
//       email: ['', [Validators.required, Validators.email]],
//       telefone: ['', Validators.required],
//       categoria: ['', Validators.required],
//       historia: [''],
//       cnpj: ['', Validators.required],
//       endereco: this.fb.group({
//         cep: ['', Validators.required],
//         rua: ['', Validators.required],
//         numero: ['', Validators.required],
//         complemento: [''],
//         bairro: ['', Validators.required],
//         cidade: ['', Validators.required],
//         uf: ['', Validators.required]
//       })
//     });
//   }
//
//   carregarCategorias(): void {
//     this.http.get<string[]>('http://localhost:8080/instituicoes/categorias').subscribe({
//       next: res => this.categorias = res,
//       error: () => this.toastr.error('Erro ao carregar categorias')
//     });
//   }
//
//   carregarInstituicao(): void {
//     const headers = { 'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}` };
//     this.http.get<any>(`http://localhost:8080/instituicoes/${this.id}`, { headers }).subscribe({
//       next: res => {
//         this.form.patchValue({
//           nomeInstituicao: res.nomeInstituicao,
//           email: res.email,
//           telefone: res.telefone,
//           categoria: res.categoria,
//           historia: res.historia,
//           cnpj: res.cnpj,
//           endereco: res.endereco
//         });
//
//         this.cnpjOriginal = res.cnpj?.replace(/\D/g, '') || '';
//         this.emailOriginal = res.email;
//         this.imagemUrl = res.imagemPerfil
//           ? `data:image/png;base64,${res.imagemPerfil}`
//           : '/assets/svg/perfil-padrao.svg';
//       },
//       error: () => this.toastr.error('Erro ao carregar dados')
//     });
//   }
//
//   validarCnpj(cnpj: string) {
//     const body = { cnpj };
//     this.http.post<any>('http://localhost:8080/instituicoes/validar-cnpj', body).subscribe({
//       next: () => {},
//       error: err => {
//         const mensagem = err.error?.mensagem || 'Erro ao validar CNPJ';
//         this.toastr.error(mensagem);
//       }
//     });
//   }
//
//   validarEmail(email: string) {
//     this.http.get<any[]>('http://localhost:8080/instituicoes').subscribe({
//       next: instituicoes => {
//         const emailExistente = instituicoes.some(inst =>
//           inst.email?.toLowerCase() === email.toLowerCase() && inst.idInstituicao !== this.id
//         );
//         if (emailExistente) {
//           this.toastr.error('Email já está em uso por outra instituição');
//         }
//       },
//       error: () => this.toastr.error('Erro ao validar email')
//     });
//   }
//
//   buscarCep(cep: string): void {
//     this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
//       next: data => {
//         if (data.erro) {
//           this.toastr.error('CEP não encontrado');
//           return;
//         }
//         this.form.patchValue({
//           endereco: {
//             rua: data.logradouro,
//             bairro: data.bairro,
//             cidade: data.localidade,
//             uf: data.uf
//           }
//         });
//       },
//       error: () => this.toastr.error('Erro ao buscar CEP')
//     });
//   }
//
//   aoSelecionarImagem(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       this.imagemSelecionada = file;
//       const reader = new FileReader();
//       reader.onload = e => this.imagemUrl = e.target?.result as string;
//       reader.readAsDataURL(file);
//     }
//   }
//
//   removerImagem(): void {
//     const token = sessionStorage.getItem('auth-token');
//     if (!token) {
//       this.toastr.error('Você precisa estar logado.');
//       return;
//     }
//
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//
//     this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, {}, { headers }).subscribe({
//       next: () => {
//         this.imagemSelecionada = null;
//         this.imagemUrl = '/assets/svg/perfil-padrao.svg';
//         this.toastr.success('Imagem removida com sucesso!');
//       },
//       error: () => {
//         this.toastr.error('Erro ao remover imagem.');
//       }
//     });
//   }
//
//   abrirModalSenha(): void {
//     this.mostrarModalSenha = true;
//   }
//
//   cancelarModal(): void {
//     this.mostrarModalSenha = false;
//     this.senhaConfirmacao = '';
//   }
//
//   confirmarSenha(): void {
//     if (!this.senhaConfirmacao) {
//       this.toastr.error('Senha obrigatória');
//       return;
//     }
//
//     this.salvar();
//   }
//
//   salvar(): void {
//     if (this.form.invalid) {
//       this.toastr.error('Preencha todos os campos obrigatórios');
//       this.form.markAllAsTouched();
//       return;
//     }
//
//     const cep = this.form.get('endereco.cep')?.value.replace(/\D/g, '');
//     const cnpj = this.form.get('cnpj')?.value.replace(/\D/g, '');
//
//     if (cep.length !== 8) {
//       this.toastr.error('CEP inválido');
//       return;
//     }
//
//     if (cnpj.length !== 14) {
//       this.toastr.error('CNPJ inválido');
//       return;
//     }
//
//     const token = sessionStorage.getItem('auth-token');
//     if (!token) {
//       this.toastr.error('Você precisa estar logado.');
//       return;
//     }
//
//     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
//
//     const dto = {
//       ...this.form.getRawValue(),
//       senhaAtual: this.senhaConfirmacao
//     };
//
//     this.http.put(`http://localhost:8080/instituicoes/${this.id}`, dto, { headers }).subscribe({
//       next: () => {
//         this.cancelarModal();
//
//         if (this.imagemSelecionada !== null) {
//           const formData = new FormData();
//           formData.append('imagem', this.imagemSelecionada);
//
//           this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, formData, { headers }).subscribe({
//             next: () => this.toastr.success('Alterações salvas com sucesso!'),
//             error: () => this.toastr.warning('Dados salvos, mas houve erro ao enviar imagem.')
//           });
//         } else {
//           this.toastr.success('Alterações salvas com sucesso!');
//         }
//       },
//       error: err => {
//         if (err.status === 400) {
//           this.toastr.error(err.error);
//         } else if (err.status === 401) {
//           this.toastr.error('Você não tem permissão para isso (401).');
//         } else {
//           this.toastr.error('Erro ao salvar alterações');
//         }
//       }
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import {SidebarAdminComponent} from "../../components/sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-admin-editar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    SidebarAdminComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './admin-editar.component.html',
  styleUrls: ['./admin-editar.component.scss']
})
export class AdminEditarComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  imagemSelecionada: File | null = null;
  imagemUrl: string = '';
  estados: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];
  categorias: string[] = [];
  cnpjOriginal: string = '';
  emailOriginal: string = '';

  mostrarModalSenha = false;
  senhaConfirmacao: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.inicializarFormulario();
    this.carregarCategorias();
    this.carregarInstituicao();

    this.form.get('cnpj')?.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(cnpj => {
        const cnpjLimpo = cnpj.replace(/\D/g, '');
        if (cnpjLimpo.length === 14 && cnpjLimpo !== this.cnpjOriginal) {
          this.validarCnpj(cnpjLimpo);
        }
      });

    this.form.get('endereco.cep')?.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(cep => {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
          this.buscarCep(cepLimpo);
        }
      });

    this.form.get('email')?.valueChanges
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe(email => {
        if (email.length >= 6 && email !== this.emailOriginal) {
          this.validarEmail(email);
        }
      });
  }

  inicializarFormulario(): void {
    this.form = this.fb.group({
      nomeInstituicao: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      categoria: ['', Validators.required],
      historia: [''],
      cnpj: ['', Validators.required],
      endereco: this.fb.group({
        cep: ['', Validators.required],
        rua: ['', Validators.required],
        numero: ['', Validators.required],
        complemento: [''],
        bairro: ['', Validators.required],
        cidade: ['', Validators.required],
        uf: ['', Validators.required]
      })
    });
  }

  carregarCategorias(): void {
    this.http.get<string[]>('http://localhost:8080/instituicoes/categorias').subscribe({
      next: res => this.categorias = res,
      error: () => this.toastr.error('Erro ao carregar categorias')
    });
  }

  carregarInstituicao(): void {
    const headers = { 'Authorization': `Bearer ${sessionStorage.getItem('auth-token')}` };
    this.http.get<any>(`http://localhost:8080/instituicoes/${this.id}`, { headers }).subscribe({
      next: res => {
        this.form.patchValue({
          nomeInstituicao: res.nomeInstituicao,
          email: res.email,
          telefone: res.telefone,
          categoria: res.categoria,
          historia: res.historia,
          cnpj: res.cnpj,
          endereco: res.endereco
        });

        this.cnpjOriginal = res.cnpj?.replace(/\D/g, '') || '';
        this.emailOriginal = res.email;
        this.imagemUrl = res.imagemPerfil
          ? `data:image/png;base64,${res.imagemPerfil}`
          : '/assets/svg/perfil-padrao.svg';
      },
      error: () => this.toastr.error('Erro ao carregar dados')
    });
  }

  validarCnpj(cnpj: string) {
    const body = { cnpj };
    this.http.post<any>('http://localhost:8080/instituicoes/validar-cnpj', body).subscribe({
      next: () => {},
      error: err => {
        const mensagem = err.error?.mensagem || 'Erro ao validar CNPJ';
        this.toastr.error(mensagem);
      }
    });
  }

  validarEmail(email: string) {
    this.http.get<any[]>('http://localhost:8080/instituicoes').subscribe({
      next: instituicoes => {
        const emailExistente = instituicoes.some(inst =>
          inst.email?.toLowerCase() === email.toLowerCase() && inst.idInstituicao !== this.id
        );
        if (emailExistente) {
          this.toastr.error('Email já está em uso por outra instituição');
        }
      },
      error: () => this.toastr.error('Erro ao validar email')
    });
  }

  buscarCep(cep: string): void {
    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: data => {
        if (data.erro) {
          this.toastr.error('CEP não encontrado ou invalido');
          return;
        }
        this.form.patchValue({
          endereco: {
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf
          }
        });
      },
      error: () => this.toastr.error('Erro ao buscar CEP')
    });
  }

  aoSelecionarImagem(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagemSelecionada = file;
      const reader = new FileReader();
      reader.onload = e => this.imagemUrl = e.target?.result as string;
      reader.readAsDataURL(file);
    }
  }

  removerImagem(): void {
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      this.toastr.error('Você precisa estar logado.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, {}, { headers }).subscribe({
      next: () => {
        this.imagemSelecionada = null;
        this.imagemUrl = '/assets/svg/perfil-padrao.svg';
        this.toastr.success('Imagem removida com sucesso!');
      },
      error: () => {
        this.toastr.error('Erro ao remover imagem.');
      }
    });
  }

  abrirModalSenha(): void {
    this.mostrarModalSenha = true;
  }

  cancelarModal(): void {
    this.mostrarModalSenha = false;
    this.senhaConfirmacao = '';
  }

  confirmarSenha(): void {
    if (!this.senhaConfirmacao) {
      this.toastr.error('Senha obrigatória');
      return;
    }

    this.salvar();
  }

  salvar(): void {
    if (this.form.invalid) {
      this.toastr.error('Preencha todos os campos obrigatórios');
      this.form.markAllAsTouched();
      return;
    }

    const cep = this.form.get('endereco.cep')?.value.replace(/\D/g, '');
    const cnpj = this.form.get('cnpj')?.value.replace(/\D/g, '');
    const email = this.form.get('email')?.value.trim().toLowerCase();
    const nome = this.form.get('nomeInstituicao')?.value.trim().toLowerCase();

    if (cep.length !== 8) {
      this.toastr.error('CEP inválido');
      return;
    }

    this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe({
      next: viaCepRes => {
        if (viaCepRes.erro) {
          this.toastr.error('CEP não encontrado');
          return;
        }

        if (cnpj.length !== 14) {
          this.toastr.error('CNPJ inválido');
          return;
        }

        this.http.get<any[]>('http://localhost:8080/instituicoes').subscribe({
          next: instituicoes => {
            const duplicado = instituicoes.find(inst =>
                inst.idInstituicao !== this.id && (
                  inst.cnpj?.replace(/\D/g, '') === cnpj ||
                  inst.email?.toLowerCase() === email ||
                  inst.nomeInstituicao?.toLowerCase() === nome
                )
            );

            if (duplicado) {
              this.toastr.error('CNPJ, email ou nome já estão cadastrados');
              return;
            }

            this.enviarDadosForm();
          },
          error: () => this.toastr.error('Erro ao validar dados duplicados')
        });
      },
      error: () => this.toastr.error('Erro ao validar o CEP')
    });
  }

  enviarDadosForm(): void {
    const token = sessionStorage.getItem('auth-token');
    if (!token) {
      this.toastr.error('Você precisa estar logado.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const dto = {
      ...this.form.getRawValue(),
      senhaAtual: this.senhaConfirmacao
    };

    this.http.put(`http://localhost:8080/instituicoes/${this.id}`, dto, { headers }).subscribe({
      next: () => {
        this.cancelarModal();

        if (this.imagemSelecionada !== null) {
          const formData = new FormData();
          formData.append('imagem', this.imagemSelecionada);

          this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, formData, { headers }).subscribe({
            next: () => this.toastr.success('Alterações salvas com sucesso!'),
            error: () => this.toastr.warning('Dados salvos, mas houve erro ao enviar imagem.')
          });
        } else {
          this.toastr.success('Alterações salvas com sucesso!');
        }
      },
      error: err => {
        if (err.status === 400) {
          this.toastr.error(err.error);
        } else if (err.status === 401) {
          this.toastr.error('Você não tem permissão para isso (401).');
        } else {
          this.toastr.error('Erro ao salvar alterações');
        }
      }
    });
  }
}
