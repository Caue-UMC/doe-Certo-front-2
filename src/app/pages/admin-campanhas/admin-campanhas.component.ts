// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// import { ToastrService } from 'ngx-toastr';
// import { SidebarComponent } from '../../components/sidebar/sidebar.component';
// import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
//
// @Component({
//   selector: 'app-admin-campanhas',
//   standalone: true,
//   imports: [CommonModule, FormsModule, SidebarComponent, NgxMaskDirective],
//   providers: [provideNgxMask()],
//   templateUrl: './admin-campanhas.component.html',
//   styleUrls: ['./admin-campanhas.component.scss']
// })
// export class AdminCampanhasComponent implements OnInit {
//   private readonly baseApi = 'http://localhost:8080/campanhas';
//   campanhas: any[] = [];
//   campanhasFiltradas: any[] = [];
//   filtro: string = '';
//
//   mostrarModalSenha = false;
//   mostrarModalImagem = false;
//   senhaConfirmacao = '';
//   acaoPendente: 'editar' | 'excluir' = 'editar';
//   campanhaSelecionada: any = null;
//
//   imagemSelecionada: File | null = null;
//   imagemPreview: string | null = null;
//   backupCampanhas: { [id: number]: any } = {};
//
//   constructor(private http: HttpClient, private toast: ToastrService) {}
//
//   ngOnInit(): void {
//     this.buscarCampanhas();
//   }
//
//   private getHeaders() {
//     const token = sessionStorage.getItem('auth-token')!;
//     return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
//   }
//
//   buscarCampanhas(): void {
//     const idInst = sessionStorage.getItem('idInstituicaoSelecionada');
//     if (!idInst) {
//       this.toast.error('ID da instituição não encontrado.');
//       return;
//     }
//     this.http.get<any[]>(`${this.baseApi}/instituicao/${idInst}`, this.getHeaders())
//       .subscribe(data => {
//         this.campanhas = data.map(c => ({
//           ...c,
//           editando: false,
//           validacaoEndereco: {},
//           mostrarEnderecoCompleto: false
//         }));
//         this.filtrarCampanhas();
//       });
//   }
//
//   filtrarCampanhas(): void {
//     const termo = this.filtro.toLowerCase();
//     this.campanhasFiltradas = this.campanhas.filter(c =>
//       c.nome.toLowerCase().includes(termo) ||
//       c.descricao.toLowerCase().includes(termo) ||
//       (c.ativa ? 'ativa' : 'inativa').includes(termo) ||
//       c.endereco?.cidade?.toLowerCase().includes(termo) ||
//       c.endereco?.uf?.toLowerCase().includes(termo)
//     );
//   }
//
//   editarCampanha(c: any): void {
//     this.backupCampanhas[c.id] = { ...c };
//     c.editando = true;
//     c.mostrarEnderecoCompleto = false;
//     this.campanhaSelecionada = c;
//   }
//
//   cancelarEdicao(c: any): void {
//     Object.assign(c, this.backupCampanhas[c.id]);
//     c.editando = false;
//   }
//
//   abrirModalSenha(c: any, acao: 'editar' | 'excluir'): void {
//     this.acaoPendente = acao;
//     this.campanhaSelecionada = c;
//     this.senhaConfirmacao = '';
//     this.mostrarModalSenha = true;
//   }
//
//   cancelarModalSenha(): void {
//     this.mostrarModalSenha = false;
//     this.campanhaSelecionada = null;
//     this.imagemSelecionada = null;
//     this.imagemPreview = null;
//   }
//
//   confirmarAcao(): void {
//     if (!this.senhaConfirmacao.trim()) {
//       this.toast.error('Senha obrigatória.');
//       return;
//     }
//     const c = this.campanhaSelecionada!;
//     const urlEditar = `${this.baseApi}/${c.id}`;
//     const headers = this.getHeaders();
//
//     if (this.acaoPendente === 'editar') {
//       if (!c.usarEnderecoInstituicao) {
//         this.buildEnderecoValidation(c);
//         if (Object.values(c.validacaoEndereco).some(v => v)) {
//           this.toast.error('Preencha os campos obrigatórios do endereço.');
//           return;
//         }
//       }
//
//       const payload: any = {
//         nome: c.nome,
//         descricao: c.descricao,
//         dataInicio: c.dataInicio,
//         dataFim: c.dataFim,
//         ativa: c.ativa,
//         usarEnderecoInstituicao: c.usarEnderecoInstituicao,
//         senha: this.senhaConfirmacao,
//         imagemCampanha: this.imagemSelecionada ? null : c.imagemCampanha
//       };
//       if (!c.usarEnderecoInstituicao) {
//         payload.endereco = c.endereco;
//       }
//
//       this.http.put(urlEditar, payload, headers).subscribe(
//         () => {
//           if (this.imagemSelecionada) {
//             const form = new FormData();
//             form.append('imagem', this.imagemSelecionada);
//             this.http.put(`${urlEditar}/imagem`, form, headers).subscribe(
//               () => {
//                 this.toast.success('Campanha e imagem atualizadas!');
//                 this.buscarCampanhas();
//                 this.cancelarModalSenha();
//               },
//               () => this.toast.error('Erro ao atualizar imagem.')
//             );
//           } else {
//             if (c.usarEnderecoInstituicao && this.backupCampanhas[c.id].endereco?.id) {
//               const oldId = this.backupCampanhas[c.id].endereco.id;
//               this.http.delete(`http://localhost:8080/enderecos/${oldId}`, headers).subscribe();
//             }
//             this.toast.success('Campanha editada com sucesso!');
//             this.buscarCampanhas();
//             this.cancelarModalSenha();
//           }
//         },
//         err => this.toast.error(typeof err.error === 'string' ? err.error : 'Erro ao editar')
//       );
//     } else {
//       this.http.delete(`${this.baseApi}/${c.id}`, {
//         ...headers,
//         body: { senha: this.senhaConfirmacao }
//       }).subscribe(
//         () => {
//           this.toast.success('Campanha excluída com sucesso!');
//           this.buscarCampanhas();
//           this.cancelarModalSenha();
//         },
//         () => this.toast.error('Erro ao excluir')
//       );
//     }
//   }
//
//   aoAlterarCheckboxEndereco(item: any): void {
//     item.endereco = item.usarEnderecoInstituicao
//       ? {}
//       : { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };
//   }
//
//   aoDigitarCepEdicao(c: any): void {
//     const cep = c.endereco.cep?.replace(/\D/g, '');
//     if (cep?.length === 8) {
//       this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
//         res => {
//           this.toast.clear();
//           if (res.erro) {
//             this.toast.error('CEP não encontrado');
//           } else {
//             Object.assign(c.endereco, {
//               rua: res.logradouro,
//               bairro: res.bairro,
//               cidade: res.localidade,
//               uf: res.uf
//             });
//           }
//         },
//         () => {
//           this.toast.clear();
//           this.toast.error('Erro ao consultar CEP');
//         }
//       );
//     }
//   }
//
//   abrirModalImagem(): void {
//     if (!this.campanhaSelecionada) {
//       this.toast.error('Selecione uma campanha antes de alterar a imagem.');
//       return;
//     }
//     this.imagemPreview = this.campanhaSelecionada.imagemCampanha
//       ? `data:image/jpeg;base64,${this.campanhaSelecionada.imagemCampanha}`
//       : null;
//     this.mostrarModalImagem = true;
//   }
//
//   removerImagemCampanha(): void {
//     this.imagemSelecionada = null;
//     this.imagemPreview = null;
//   }
//
//   fecharModalImagem(): void {
//     this.mostrarModalImagem = false;
//   }
//
//   selecionarImagemCampanha(event: Event): void {
//     const file = (event.target as HTMLInputElement).files![0];
//     this.imagemSelecionada = file;
//     const reader = new FileReader();
//     reader.onload = () => (this.imagemPreview = reader.result as string);
//     reader.readAsDataURL(file);
//   }
//
//   private buildEnderecoValidation(item: any): void {
//     const e = item.endereco;
//     item.validacaoEndereco = {
//       cepVazio: !e.cep?.trim(),
//       ruaVazia: !e.rua?.trim(),
//       numeroVazio: !e.numero?.trim(),
//       bairroVazio: !e.bairro?.trim(),
//       cidadeVazio: !e.cidade?.trim(),
//       ufVazio: !e.uf?.trim()
//     };
//   }
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import {SidebarAdminComponent} from "../../components/sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-admin-campanhas',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxMaskDirective, SidebarAdminComponent],
  providers: [provideNgxMask()],
  templateUrl: './admin-campanhas.component.html',
  styleUrls: ['./admin-campanhas.component.scss']
})
export class AdminCampanhasComponent implements OnInit {
  private readonly baseApi = 'http://localhost:8080/campanhas';
  campanhas: any[] = [];
  campanhasFiltradas: any[] = [];
  filtro: string = '';

  mostrarModalSenha = false;
  mostrarModalImagem = false;
  senhaConfirmacao = '';
  acaoPendente: 'editar' | 'excluir' | 'imagem' = 'editar';
  campanhaSelecionada: any = null;

  imagemSelecionada: File | null = null;
  imagemPreview: string | null = null;
  backupCampanhas: { [id: number]: any } = {};

  constructor(private http: HttpClient, private toast: ToastrService) {}

  ngOnInit(): void {
    this.buscarCampanhas();
  }

  private getHeaders() {
    const token = sessionStorage.getItem('auth-token')!;
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  buscarCampanhas(): void {
    const idInst = sessionStorage.getItem('idInstituicaoSelecionada');
    if (!idInst) {
      this.toast.error('ID da instituição não encontrado.');
      return;
    }
    this.http.get<any[]>(`${this.baseApi}/instituicao/${idInst}`, this.getHeaders())
      .subscribe(data => {
        this.campanhas = data.map(c => ({
          ...c,
          editando: false,
          validacaoEndereco: {},
          mostrarEnderecoCompleto: false
        }));
        this.filtrarCampanhas();
      });
  }

  filtrarCampanhas(): void {
    const termo = this.filtro.toLowerCase();
    this.campanhasFiltradas = this.campanhas.filter(c =>
      c.nome.toLowerCase().includes(termo) ||
      c.descricao.toLowerCase().includes(termo) ||
      (c.ativa ? 'ativa' : 'inativa').includes(termo) ||
      c.endereco?.cidade?.toLowerCase().includes(termo) ||
      c.endereco?.uf?.toLowerCase().includes(termo)
    );
  }

  editarCampanha(c: any): void {
    this.backupCampanhas[c.id] = { ...c };
    c.editando = true;
    c.mostrarEnderecoCompleto = false;
    this.campanhaSelecionada = c;
  }

  cancelarEdicao(c: any): void {
    Object.assign(c, this.backupCampanhas[c.id]);
    c.editando = false;
  }

  abrirModalSenha(c: any, acao: 'editar' | 'excluir'): void {
    this.acaoPendente = acao;
    this.campanhaSelecionada = c;
    this.senhaConfirmacao = '';
    this.mostrarModalSenha = true;
  }

  cancelarModalSenha(): void {
    this.mostrarModalSenha = false;
    this.campanhaSelecionada = null;
    this.imagemSelecionada = null;
    this.imagemPreview = null;
  }

  confirmarAcao(): void {
    if (this.acaoPendente !== 'imagem' && !this.senhaConfirmacao.trim()) {
      this.toast.error('Senha obrigatória.');
      return;
    }
    const c = this.campanhaSelecionada!;
    const urlEditar = `${this.baseApi}/${c.id}`;
    const headers = this.getHeaders();

    if (this.acaoPendente === 'editar') {
      if (!c.usarEnderecoInstituicao) {
        this.buildEnderecoValidation(c);
        if (Object.values(c.validacaoEndereco).some(v => v)) {
          this.toast.error('Preencha os campos obrigatórios do endereço.');
          return;
        }
      }

      const payload: any = {
        nome: c.nome,
        descricao: c.descricao,
        dataInicio: c.dataInicio,
        dataFim: c.dataFim,
        ativa: c.ativa,
        usarEnderecoInstituicao: c.usarEnderecoInstituicao,
        senha: this.senhaConfirmacao,
        imagemCampanha: this.imagemSelecionada ? null : c.imagemCampanha
      };
      if (!c.usarEnderecoInstituicao) {
        payload.endereco = c.endereco;
      }

      this.http.put(urlEditar, payload, headers).subscribe(
        () => {
          if (this.imagemSelecionada) {
            this.salvarImagemCampanha();
          } else {
            if (c.usarEnderecoInstituicao && this.backupCampanhas[c.id].endereco?.id) {
              const oldId = this.backupCampanhas[c.id].endereco.id;
              this.http.delete(`http://localhost:8080/enderecos/${oldId}`, headers).subscribe();
            }
            this.toast.success('Campanha editada com sucesso!');
            this.buscarCampanhas();
            this.cancelarModalSenha();
          }
        },
        err => this.toast.error(typeof err.error === 'string' ? err.error : 'Erro ao editar')
      );
    } else {
      this.http.delete(`${this.baseApi}/${c.id}`, {
        ...headers,
        body: { senha: this.senhaConfirmacao }
      }).subscribe(
        () => {
          this.toast.success('Campanha excluída com sucesso!');
          this.buscarCampanhas();
          this.cancelarModalSenha();
        },
        () => this.toast.error('Erro ao excluir')
      );
    }
  }

  salvarImagemCampanha(): void {
    if (!this.campanhaSelecionada) return;

    const form = new FormData();
    if (this.imagemSelecionada) {
      form.append('imagem', this.imagemSelecionada);
    }

    this.http.put(`${this.baseApi}/${this.campanhaSelecionada.id}/imagem`, form, this.getHeaders())
      .subscribe(
        () => {
          this.toast.success('Imagem atualizada!');
          this.buscarCampanhas();
          this.fecharModalImagem();
        },
        () => this.toast.error('Erro ao salvar imagem.')
      );
  }

  aoAlterarCheckboxEndereco(item: any): void {
    item.endereco = item.usarEnderecoInstituicao
      ? {}
      : { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };
  }

  aoDigitarCepEdicao(c: any): void {
    const cep = c.endereco.cep?.replace(/\D/g, '');
    if (cep?.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
        res => {
          this.toast.clear();
          if (res.erro) {
            this.toast.error('CEP não encontrado');
          } else {
            Object.assign(c.endereco, {
              rua: res.logradouro,
              bairro: res.bairro,
              cidade: res.localidade,
              uf: res.uf
            });
          }
        },
        () => {
          this.toast.clear();
          this.toast.error('Erro ao consultar CEP');
        }
      );
    }
  }

  abrirModalImagem(): void {
    if (!this.campanhaSelecionada) {
      this.toast.error('Selecione uma campanha antes de alterar a imagem.');
      return;
    }
    this.imagemPreview = this.campanhaSelecionada.imagemCampanha
      ? `data:image/jpeg;base64,${this.campanhaSelecionada.imagemCampanha}`
      : null;
    this.mostrarModalImagem = true;
    this.acaoPendente = 'imagem';
  }

  removerImagemCampanha(): void {
    this.imagemSelecionada = null;
    this.imagemPreview = null;
  }

  fecharModalImagem(): void {
    this.mostrarModalImagem = false;
  }

  selecionarImagemCampanha(event: Event): void {
    const file = (event.target as HTMLInputElement).files![0];
    this.imagemSelecionada = file;
    const reader = new FileReader();
    reader.onload = () => (this.imagemPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  private buildEnderecoValidation(item: any): void {
    const e = item.endereco;
    item.validacaoEndereco = {
      cepVazio: !e.cep?.trim(),
      ruaVazia: !e.rua?.trim(),
      numeroVazio: !e.numero?.trim(),
      bairroVazio: !e.bairro?.trim(),
      cidadeVazio: !e.cidade?.trim(),
      ufVazio: !e.uf?.trim()
    };
  }
}
