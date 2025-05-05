import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-instituicao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './instituicao.component.html',
  styleUrls: ['./instituicao.component.scss']
})
export class InstituicaoComponent implements OnInit {
  nomeInstituicao: string = '';
  imagemBase64: string = '';
  produtos: any[] = [];

  mostrarModal = false;
  novoItem = {
    nome: '',
    descricao: '',
    status: ''
  };
  statusOptions: string[] = [];

  // Modal de senha
  mostrarModalSenha = false;
  senhaConfirmacao = '';
  acaoPendente: 'editar' | 'excluir' = 'editar';
  itemSelecionado: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const id = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    // Buscar dados da instituição
    this.http.get<any>(`http://localhost:8080/instituicoes/${id}`, { headers })
      .subscribe(data => {
        this.nomeInstituicao = data.nomeInstituicao;
        this.imagemBase64 = data.imagemPerfil;
      });

    // Buscar lista de produtos
    this.http.get<any[]>(`http://localhost:8080/lista/instituicao/${id}`, { headers })
      .subscribe(data => {
        this.produtos = data;
      });

    // Buscar status
    this.http.get<string[]>(`http://localhost:8080/lista/status`, { headers })
      .subscribe(status => {
        this.statusOptions = status;
      });
  }

  // Abrir modal para novo item
  abrirModal() {
    this.novoItem = { nome: '', descricao: '', status: '' };
    this.mostrarModal = true;
  }

  fecharModal() {
    this.mostrarModal = false;
  }

  salvarItem() {
    const id = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    const payload = {
      nome: this.novoItem.nome,
      descricao: this.novoItem.descricao,
      statusProduto: this.novoItem.status,
      idInstituicao: id
    };

    this.http.post(`http://localhost:8080/lista`, payload, { headers })
      .subscribe(() => {
        this.toast.success('Item cadastrado com sucesso!');
        this.fecharModal();
        this.ngOnInit();
      });
  }

  editarConta() {
    this.router.navigate(['/user']);
  }

  // Abrir modal de senha para editar ou excluir
  abrirModalSenha(item: any, acao: 'editar' | 'excluir') {
    this.itemSelecionado = item;
    this.acaoPendente = acao;
    this.senhaConfirmacao = '';
    this.mostrarModalSenha = true;
  }

  // Cancelar modal de senha
  cancelarModalSenha() {
    this.mostrarModalSenha = false;
    this.itemSelecionado = null;
    this.acaoPendente = 'editar';
    this.senhaConfirmacao = '';
  }

  // Confirmar ação (editar ou excluir) com senha
  confirmarAcao() {
    if (!this.itemSelecionado || !this.senhaConfirmacao) return;

    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    if (this.acaoPendente === 'editar') {
      const body = {
        nomeProduto: this.itemSelecionado.nome,
        descricao: this.itemSelecionado.descricao,
        statusProduto: this.itemSelecionado.statusProduto,
        senha: this.senhaConfirmacao
      };

      this.http.put(`http://localhost:8080/lista/${this.itemSelecionado.id}`, body, { headers })
        .subscribe({
          next: () => {
            this.toast.success('Item editado com sucesso!');
            this.itemSelecionado.editando = false;
            this.cancelarModalSenha();
          }
        });

    } else if (this.acaoPendente === 'excluir') {
      const options = {
        headers,
        body: { senha: this.senhaConfirmacao }
      };

      this.http.delete(`http://localhost:8080/lista/${this.itemSelecionado.id}`, options)
        .subscribe({
          next: () => {
            this.toast.success('Item excluído com sucesso!');
            this.cancelarModalSenha();
            this.ngOnInit();
          }
        });
    }
  }

  // Cancelar edição inline
  cancelarEdicao(item: any) {
    item.editando = false;
  }

}
