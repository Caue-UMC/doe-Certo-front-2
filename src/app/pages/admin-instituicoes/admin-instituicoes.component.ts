import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { SidebarAdminComponent } from "../../components/sidebar-admin/sidebar-admin.component";

@Component({
  selector: 'app-admin-instituicoes',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, SidebarAdminComponent],
  templateUrl: './admin-instituicoes.component.html',
  styleUrls: ['./admin-instituicoes.component.scss']
})
export class AdminInstituicoesComponent implements OnInit {
  instituicoes: any[] = [];
  categorias: string[] = [];

  ufs: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  filtro: string = '';
  filtroCidade: string = '';
  filtroCategoria: string = '';
  filtroUf: string = '';

  mostrarModalSenha = false;
  senhaConfirmacao: string = '';
  idParaExcluir: number | null = null;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarInstituicoes();
    this.carregarCategorias();
  }

  carregarInstituicoes(): void {
    const headers = {
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`
    };

    this.http.get<any[]>('http://localhost:8080/instituicoes', { headers }).subscribe({
      next: res => this.instituicoes = res,
      error: () => this.toastr.error('Erro ao carregar instituições')
    });
  }

  carregarCategorias(): void {
    this.http.get<string[]>('http://localhost:8080/instituicoes/categorias').subscribe({
      next: res => this.categorias = res,
      error: () => this.toastr.error('Erro ao carregar categorias')
    });
  }

  get instituicoesFiltradas(): any[] {
    const termo = this.normalize(this.filtro.trim().toLowerCase());
    const cidade = this.normalize(this.filtroCidade.trim().toLowerCase());
    const categoria = this.normalize(this.filtroCategoria.trim().toLowerCase());
    const uf = this.filtroUf.trim().toUpperCase();

    return this.instituicoes.filter(inst => {
      const nome = this.normalize(inst.nomeInstituicao || '');
      const email = this.normalize(inst.email || '');
      const cat = this.normalize(inst.categoria || '');
      const cid = this.normalize(inst.endereco?.cidade || '');
      const estado = inst.endereco?.uf?.toUpperCase() || '';

      return (
        (nome.includes(termo) || email.includes(termo)) &&
        (cidade === '' || cid.includes(cidade)) &&
        (categoria === '' || cat === categoria) &&
        (uf === '' || estado === uf)
      );
    });
  }

  normalize(texto: string): string {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // remove acentos
  }

  editar(id: number): void {
    this.router.navigate(['/admin/editar', id]);
  }

  verCampanhas(id: number): void {
    sessionStorage.setItem('idInstituicaoSelecionada', id.toString());
    this.router.navigate([`/admin/instituicao/${id}/campanhas`]);
  }

  verListas(id: number): void {
    this.router.navigate([`/admin/instituicao/${id}/listas`]);
  }

  abrirModalSenha(id: number): void {
    this.idParaExcluir = id;
    this.senhaConfirmacao = '';
    this.mostrarModalSenha = true;
  }

  cancelarModal(): void {
    this.mostrarModalSenha = false;
    this.senhaConfirmacao = '';
    this.idParaExcluir = null;
  }

  confirmarExclusao(): void {
    if (!this.senhaConfirmacao?.trim()) {
      this.toastr.error('Senha obrigatória');
      return;
    }

    if (!this.idParaExcluir) {
      this.toastr.error('ID inválido');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${sessionStorage.getItem('auth-token')}`
    });

    const body = { senha: this.senhaConfirmacao };

    this.http.request('delete', `http://localhost:8080/instituicoes/${this.idParaExcluir}`, {
      headers,
      body
    }).subscribe({
      next: () => {
        this.toastr.success('Instituição excluída com sucesso');
        this.cancelarModal();
        this.carregarInstituicoes();
      },
      error: err => {
        this.cancelarModal();

        if (err.status === 400 && typeof err.error === 'string') {
          this.toastr.error(err.error); // mostra mensagem retornada do backend
        } else if (err.status === 403) {
          this.toastr.error('Acesso negado.');
        } else {
          this.toastr.error('Erro ao excluir instituição');
        }
      }
    });
  }
}
