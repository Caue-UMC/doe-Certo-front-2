import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-campanha',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NgxMaskDirective],
  providers: [provideNgxMask()],
  templateUrl: './campanha-instituicao.component.html',
  styleUrls: ['./campanha-instituicao.component.scss']
})
export class CampanhaInstituicaoComponent implements OnInit {
  private readonly baseApi = 'http://localhost:8080/campanhas';
  campanhas: any[] = [];
  mostrarModal = false;
  mostrarModalSenha = false;
  mostrarModalImagem = false;
  senhaConfirmacao = '';
  acaoPendente: 'editar' | 'excluir' = 'editar';
  campanhaSelecionada: any = null;

  imagemSelecionada: File | null = null;
  imagemPreview: string | null = null;

  backupCampanhas: { [id: number]: any } = {};

  novoItem: any = {
    nome: '',
    descricao: '',
    dataInicio: '',
    dataFim: '',
    ativa: true,
    usarEnderecoInstituicao: true,
    endereco: {},
    mostrarEnderecoCompleto: false,
    validacaoEndereco: {}
  };

  // flags de validação
  nomeVazio = false;
  descricaoVazia = false;
  dataInicioVazia = false;
  dataFimVazia = false;
  cepVazio = false;
  ruaVazia = false;
  numeroVazio = false;
  bairroVazio = false;
  cidadeVazia = false;
  ufVazia = false;

  constructor(private http: HttpClient, private toast: ToastrService) {}

  ngOnInit(): void {
    this.buscarCampanhas();
  }

  private getHeaders() {
    const token = sessionStorage.getItem('auth-token')!;
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  buscarCampanhas(): void {
    const idInst = sessionStorage.getItem('id')!;
    this.http
      .get<any[]>(`${this.baseApi}/instituicao/${idInst}`, this.getHeaders())
      .subscribe(data => {
        this.campanhas = data.map(c => ({
          ...c,
          editando: false,
          validacaoEndereco: {},
          mostrarEnderecoCompleto: false
        }));
      });
  }

  abrirModal(): void {
    this.novoItem = {
      nome: '',
      descricao: '',
      dataInicio: '',
      dataFim: '',
      ativa: true,
      usarEnderecoInstituicao: true,
      endereco: {},
      mostrarEnderecoCompleto: false,
      validacaoEndereco: {}
    };
    this.clearValidationFlags();
    this.imagemSelecionada = null;
    this.imagemPreview = null;
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
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
    const c = this.campanhaSelecionada!;
    const headers = this.getHeaders();

    if (this.acaoPendente === 'editar') {
      if (this.mostrarModalImagem) {
        // IMAGEM: salvar ou remover
        const form = new FormData();
        if (this.imagemSelecionada) {
          form.append('imagem', this.imagemSelecionada);
        }
        this.http.put(`${this.baseApi}/${c.id}/imagem`, form, headers).subscribe(
          () => {
            this.toast.success('Imagem atualizada com sucesso!');
            this.fecharModalImagem();
            this.buscarCampanhas();
          },
          () => this.toast.error('Erro ao salvar imagem.')
        );
        return;
      }

      // Validação de senha
      if (!this.senhaConfirmacao.trim()) {
        this.toast.error('Senha obrigatória.');
        return;
      }

      // Validação de endereço
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

      this.http.put(`${this.baseApi}/${c.id}`, payload, headers).subscribe(
        () => {
          this.toast.success('Campanha editada com sucesso!');
          this.buscarCampanhas();
          this.cancelarModalSenha();
        },
        err => this.toast.error(typeof err.error === 'string' ? err.error : 'Erro ao editar')
      );

    } else if (this.acaoPendente === 'excluir') {
      if (!this.senhaConfirmacao.trim()) {
        this.toast.error('Senha obrigatória.');
        return;
      }

      this.http
        .delete(`${this.baseApi}/${c.id}`, {
          ...headers,
          body: { senha: this.senhaConfirmacao }
        })
        .subscribe(
          () => {
            this.toast.success('Campanha excluída com sucesso!');
            this.buscarCampanhas();
            this.cancelarModalSenha();
          },
          () => this.toast.error('Erro ao excluir')
        );
    }
  }


  // confirmarAcao(): void {
  //   if (!this.senhaConfirmacao.trim()) {
  //     this.toast.error('Senha obrigatória.');
  //     return;
  //   }
  //   const c = this.campanhaSelecionada!;
  //   const urlEditar = `${this.baseApi}/${c.id}`;
  //   const headers = this.getHeaders();
  //
  //   if (this.acaoPendente === 'editar') {
  //     // validação de endereço
  //     if (!c.usarEnderecoInstituicao) {
  //       this.buildEnderecoValidation(c);
  //       if (Object.values(c.validacaoEndereco).some(v => v)) {
  //         this.toast.error('Preencha os campos obrigatórios do endereço.');
  //         return;
  //       }
  //     }
  //
  //     // montar payload JSON (sem multipart)
  //     const payload: any = {
  //       nome: c.nome,
  //       descricao: c.descricao,
  //       dataInicio: c.dataInicio,
  //       dataFim: c.dataFim,
  //       ativa: c.ativa,
  //       usarEnderecoInstituicao: c.usarEnderecoInstituicao,
  //       senha: this.senhaConfirmacao,
  //       imagemCampanha: this.imagemSelecionada ? null : c.imagemCampanha
  //     };
  //     if (!c.usarEnderecoInstituicao) {
  //       payload.endereco = c.endereco;
  //     }
  //
  //     // PUT JSON
  //     this.http.put(urlEditar, payload, headers).subscribe(
  //       () => {
  //         // se imagem nova, chama endpoint específico
  //         if (this.imagemSelecionada) {
  //           const form = new FormData();
  //           form.append('imagem', this.imagemSelecionada);
  //           this.http
  //             .put(`${urlEditar}/imagem`, form, headers)
  //             .subscribe(
  //               () => {
  //                 this.toast.success('Campanha e imagem atualizadas!');
  //                 this.buscarCampanhas();
  //                 this.cancelarModalSenha();
  //               },
  //               () => this.toast.error('Erro ao atualizar imagem.')
  //             );
  //         } else {
  //           // deleta endereço antigo se agora usa o da instituição
  //           if (c.usarEnderecoInstituicao && this.backupCampanhas[c.id].endereco?.id) {
  //             const oldId = this.backupCampanhas[c.id].endereco.id;
  //             this.http.delete(`http://localhost:8080/enderecos/${oldId}`, headers).subscribe();
  //           }
  //           this.toast.success('Campanha editada com sucesso!');
  //           this.buscarCampanhas();
  //           this.cancelarModalSenha();
  //         }
  //       },
  //       err => this.toast.error(typeof err.error === 'string' ? err.error : 'Erro ao editar')
  //     );
  //   } else {
  //     // exclusão
  //     this.http
  //       .delete(`${this.baseApi}/${c.id}`, {
  //         ...headers,
  //         body: { senha: this.senhaConfirmacao }
  //       })
  //       .subscribe(
  //         () => {
  //           this.toast.success('Campanha excluída com sucesso!');
  //           this.buscarCampanhas();
  //           this.cancelarModalSenha();
  //         },
  //         () => this.toast.error('Erro ao excluir')
  //       );
  //   }
  // }

  salvarItem(): void {
    this.clearValidationFlags();
    this.nomeVazio = !this.novoItem.nome.trim();
    this.descricaoVazia = !this.novoItem.descricao.trim();
    this.dataInicioVazia = !this.novoItem.dataInicio;
    this.dataFimVazia = !this.novoItem.dataFim;

    if (
      this.nomeVazio ||
      this.descricaoVazia ||
      this.dataInicioVazia ||
      this.dataFimVazia
    ) {
      this.toast.error('Preencha todos os campos obrigatórios.');
      return;
    }

    if (!this.novoItem.usarEnderecoInstituicao) {
      this.buildEnderecoValidation(this.novoItem);
      if (Object.values(this.novoItem.validacaoEndereco).some(v => v)) {
        this.toast.error('Preencha todos os campos do endereço.');
        return;
      }
    }

    const payload: any = {
      nome: this.novoItem.nome,
      descricao: this.novoItem.descricao,
      dataInicio: this.novoItem.dataInicio,
      dataFim: this.novoItem.dataFim,
      ativa: this.novoItem.ativa,
      usarEnderecoInstituicao: this.novoItem.usarEnderecoInstituicao,
      idInstituicao: sessionStorage.getItem('id')
    };
    if (!this.novoItem.usarEnderecoInstituicao) {
      payload.endereco = this.novoItem.endereco;
    }

    this.http.post(`${this.baseApi}`, payload, this.getHeaders()).subscribe(
      (res: any) => {
        if (this.imagemSelecionada && res.id) {
          const form = new FormData();
          form.append('imagem', this.imagemSelecionada);
          this.http
            .put(`${this.baseApi}/${res.id}/imagem`, form, this.getHeaders())
            .subscribe(() => this.buscarCampanhas());
        } else {
          this.buscarCampanhas();
        }
        this.toast.success('Campanha criada com sucesso!');
        this.fecharModal();
      },
      () => this.toast.error('Erro ao cadastrar campanha.')
    );
  }

  aoDigitarCep(): void {
    const cep = this.novoItem.endereco.cep?.replace(/\D/g, '');
    if (cep?.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(
        res => {
          this.toast.clear();
          if (res.erro) {
            this.toast.error('CEP não encontrado');
          } else {
            Object.assign(this.novoItem.endereco, {
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

  aoAlterarCheckboxEndereco(item: any): void {
    item.endereco = item.usarEnderecoInstituicao
      ? {}
      : { cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', uf: '' };
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

  enviarImagem(): void {
    if (!this.imagemSelecionada || !this.campanhaSelecionada) {
      this.toast.error('Selecione uma imagem.');
      return;
    }
    const headers = this.getHeaders();
    this.http
      .put(
        `${this.baseApi}/${this.campanhaSelecionada.id}/imagem`,
        (() => {
          const form = new FormData();
          form.append('imagem', this.imagemSelecionada!);
          return form;
        })(),
        headers
      )
      .subscribe(
        () => {
          this.toast.success('Imagem atualizada com sucesso!');
          this.fecharModalImagem();
          this.buscarCampanhas();
        },
        () => this.toast.error('Erro ao enviar imagem.')
      );
  }

  private clearValidationFlags(): void {
    this.nomeVazio =
      this.descricaoVazia =
        this.dataInicioVazia =
          this.dataFimVazia =
            this.cepVazio =
              this.ruaVazia =
                this.numeroVazio =
                  this.bairroVazio =
                    this.cidadeVazia =
                      this.ufVazia =
                        false;
  }

  private buildEnderecoValidation(item: any): void {
    const e = item.endereco;
    item.validacaoEndereco = {
      cepVazio: !e.cep?.trim(),
      ruaVazia: !e.rua?.trim(),
      numeroVazio: !e.numero?.trim(),
      bairroVazio: !e.bairro?.trim(),
      cidadeVazia: !e.cidade?.trim(),
      ufVazia: !e.uf?.trim()
    };
  }
}



