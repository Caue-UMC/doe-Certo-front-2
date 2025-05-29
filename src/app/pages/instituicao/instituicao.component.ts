import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-instituicao',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './instituicao.component.html',
  styleUrls: ['./instituicao.component.scss']
})
export class InstituicaoComponent implements OnInit {
  produtos: any[] = [];
  statusOptions: string[] = [];

  mostrarModal = false;
  mostrarModalSenha = false;

  novoItem = { nome: '', descricao: '', status: '' };
  senhaConfirmacao = '';
  acaoPendente: 'editar' | 'excluir' = 'editar';
  itemSelecionado: any = null;
  backupProdutos: { [id: string]: any } = {};

  nomeVazio = false;
  descricaoVazia = false;
  statusVazio = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    const id = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(`http://localhost:8080/lista/instituicao/${id}`, { headers })
      .subscribe(data => this.produtos = data);

    this.http.get<string[]>(`http://localhost:8080/lista/status`, { headers })
      .subscribe(status => this.statusOptions = status);
  }

  abrirModal(): void {
    this.novoItem = { nome: '', descricao: '', status: '' };
    this.nomeVazio = false;
    this.descricaoVazia = false;
    this.statusVazio = false;
    this.mostrarModal = true;
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  salvarItem(): void {
    this.nomeVazio = !this.novoItem.nome.trim();
    this.descricaoVazia = !this.novoItem.descricao.trim();
    this.statusVazio = !this.novoItem.status;

    if (this.nomeVazio || this.descricaoVazia || this.statusVazio) {
      this.toast.error('Preencha todos os campos antes de salvar.');
      return;
    }

    const id = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const payload = {
      nome: this.novoItem.nome,
      descricao: this.novoItem.descricao,
      statusProduto: this.novoItem.status,
      idInstituicao: id
    };

    this.http.post(`http://localhost:8080/lista`, payload, { headers }).subscribe(() => {
      this.toast.success('Item cadastrado com sucesso!');
      this.fecharModal();
      this.ngOnInit();
    });
  }

  editarItem(item: any): void {
    this.backupProdutos[item.id] = JSON.parse(JSON.stringify(item));
    item.editando = true;
  }

  cancelarEdicao(item: any): void {
    const original = this.backupProdutos[item.id];
    if (original) {
      Object.assign(item, original);
      item.editando = false;
    }
  }

  abrirModalSenha(item: any, acao: 'editar' | 'excluir'): void {
    this.itemSelecionado = item;
    this.acaoPendente = acao;
    this.senhaConfirmacao = '';
    this.mostrarModalSenha = true;
  }

  cancelarModalSenha(): void {
    this.mostrarModalSenha = false;
    this.itemSelecionado = null;
    this.acaoPendente = 'editar';
    this.senhaConfirmacao = '';
  }

  confirmarAcao(): void {
    if (!this.itemSelecionado) return;

    if (!this.senhaConfirmacao.trim()) {
      this.toast.error('Senha obrigatória.');
      return;
    }

    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    if (this.acaoPendente === 'editar') {
      const nome = this.itemSelecionado.nome?.trim();
      const descricao = this.itemSelecionado.descricao?.trim();
      const status = this.itemSelecionado.statusProduto;

      if (!nome || !descricao || !status) {
        this.toast.error('Preencha todos os campos antes de salvar.');
        return;
      }

      const body = {
        nomeProduto: nome,
        descricao: descricao,
        statusProduto: status,
        senha: this.senhaConfirmacao
      };

      this.http.put(`http://localhost:8080/lista/${this.itemSelecionado.id}`, body, { headers })
        .subscribe({
          next: () => {
            this.toast.success('Item editado com sucesso!');
            this.itemSelecionado.editando = false;
            delete this.backupProdutos[this.itemSelecionado.id];
            this.cancelarModalSenha();
          },
          error: (err) => {
            this.toast.error(err.error); // <-- ESSENCIAL
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
          },
          error: (err) => {
            this.toast.error(err.error);
          }
        });
    }
  }
}
