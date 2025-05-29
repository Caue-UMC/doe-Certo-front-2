import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  busca = '';
  dropdownAberto = false;
  resultados: any[] = [];
  nenhumResultado = false;

  isAdmin = false;
  nomeUsuario = 'Usuário';
  imagemUsuario = 'assets/svg/perfil-padrao.svg';

  constructor(private router: Router, private http: HttpClient, private toast: ToastrService) {
    this.carregarUsuario();
  }

  get estaLogado(): boolean {
    return !!sessionStorage.getItem('auth-token');
  }

  carregarUsuario() {
    try {
      const admin = sessionStorage.getItem('admin');
      const inst = sessionStorage.getItem('instituicao');

      if (admin) {
        this.isAdmin = true;
        const adminData = JSON.parse(admin);
        this.nomeUsuario = adminData.nome || 'Administrador';
        this.imagemUsuario = 'assets/png/adm-padrao-icon.png';
      } else if (inst) {
        const instData = JSON.parse(inst);
        this.nomeUsuario = instData.nomeInstituicao || 'Instituição';
        this.imagemUsuario = instData.imagemPerfil
          ? 'data:image/jpeg;base64,' + instData.imagemPerfil
          : 'assets/svg/perfil-padrao.svg';
      }
    } catch (e) {
      sessionStorage.clear();
      this.toast.error('Erro ao carregar dados da sessão. Faça login novamente.');
      this.router.navigate(['/login']);
    }
  }

  toggleDropdown() {
    this.dropdownAberto = !this.dropdownAberto;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  sair() {
    sessionStorage.clear();
    this.toast.success('Você saiu com sucesso!');
    this.router.navigate(['/home']);
  }

  buscarInstituicao() {
    const nome = this.busca.trim();
    if (!nome) {
      this.resultados = [];
      this.nenhumResultado = false;
      return;
    }

    this.http.get<any>(`http://localhost:8080/instituicoes/publico?nome=${nome}`).subscribe({
      next: res => {
        const lista = res.content || [];
        this.resultados = lista;
        this.nenhumResultado = lista.length === 0;
      },
      error: () => {
        this.resultados = [];
        this.nenhumResultado = true;
      }
    });
  }

  irParaInstituicao(id: number) {
    this.router.navigate(['/instituicoes', id]);
    this.busca = '';
    this.resultados = [];
    this.nenhumResultado = false;
  }

  irParaConfiguracoes() {
    if (this.isAdmin) {
      this.router.navigate(['/admin/instituicoes']);
    } else {
      this.router.navigate(['/user']);
    }
  }

}
