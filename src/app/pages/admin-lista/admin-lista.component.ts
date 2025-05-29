import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {SidebarAdminComponent} from "../../components/sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-admin-lista',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarAdminComponent],
  templateUrl: './admin-lista.component.html',
  styleUrls: ['./admin-lista.component.scss']
})
export class AdminListaComponent implements OnInit {
  lista: any[] = [];
  listaFiltrada: any[] = [];
  filtro: string = '';
  idInstituicao!: number;

  statusOptions: string[] = [];

  mostrarModalSenha = false;
  senhaConfirmacao: string = '';
  senhaInvalida = false;

  acaoPendente: 'editar' | 'excluir' = 'editar';
  itemSelecionado: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.idInstituicao = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarLista();
    this.carregarStatus();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set('Authorization', 'Bearer ' + sessionStorage.getItem('auth-token'));
  }

  carregarLista(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>(`http://localhost:8080/lista/instituicao/${this.idInstituicao}`, { headers }).subscribe({
      next: (data) => {
        this.lista = data.map(i => ({ ...i, editando: false }));
        this.filtrarLista();
      },
      error: () => this.toastr.error('Erro ao carregar a lista.')
    });
  }

  carregarStatus(): void {
    const headers = this.getAuthHeaders();
    this.http.get<string[]>(`http://localhost:8080/lista/status`, { headers }).subscribe({
      next: (res) => this.statusOptions = res,
      error: () => this.toastr.error('Erro ao carregar os status.')
    });
  }

  filtrarLista(): void {
    const filtroLower = this.filtro.toLowerCase();
    this.listaFiltrada = this.lista.filter(item =>
      item.nome.toLowerCase().includes(filtroLower) ||
      item.statusProduto.toLowerCase().includes(filtroLower)
    );
  }

  editarItem(item: any): void {
    this.lista.forEach(i => i.editando = false);
    item.editando = true;
  }

  cancelarEdicao(item: any): void {
    item.editando = false;
    this.carregarLista(); // recarrega o valor original
  }

  abrirModalSenha(item: any, acao: 'editar' | 'excluir'): void {
    this.itemSelecionado = item;
    this.acaoPendente = acao;
    this.senhaConfirmacao = '';
    this.senhaInvalida = false;
    this.mostrarModalSenha = true;
  }

  cancelarModalSenha(): void {
    this.mostrarModalSenha = false;
    this.senhaConfirmacao = '';
    this.itemSelecionado = null;
  }

  confirmarAcao(): void {
    if (!this.senhaConfirmacao.trim()) {
      this.senhaInvalida = true;
      this.toastr.error('Senha obrigatória.');
      return;
    }

    if (this.acaoPendente === 'excluir') {
      this.excluirItem();
    } else {
      this.salvarEdicao();
    }
  }

  excluirItem(): void {
    const headers = this.getAuthHeaders();
    const body = { senha: this.senhaConfirmacao };

    this.http.request('delete', `http://localhost:8080/lista/${this.itemSelecionado.id}`, { body, headers }).subscribe({
      next: () => {
        this.toastr.success('Item excluído com sucesso!');
        this.carregarLista();
        this.cancelarModalSenha();
      },
      error: (err) => {
        this.toastr.error(err.error || 'Erro ao excluir. Verifique a senha.');
      }
    });
  }

  salvarEdicao(): void {
    if (!this.itemSelecionado.nome?.trim() || !this.itemSelecionado.statusProduto) {
      this.toastr.error('Preencha todos os campos obrigatórios.');
      return;
    }

    const body = {
      nome: this.itemSelecionado.nome,
      statusProduto: this.itemSelecionado.statusProduto,
      senha: this.senhaConfirmacao
    };

    const headers = this.getAuthHeaders();

    this.http.put(`http://localhost:8080/lista/${this.itemSelecionado.id}`, body, { headers }).subscribe({
      next: () => {
        this.toastr.success('Item atualizado com sucesso!');
        this.carregarLista();
        this.cancelarModalSenha();
      },
      error: (err) => {
        this.toastr.error(err.error || 'Erro ao salvar. Verifique a senha.');
      }
    });
  }
}
