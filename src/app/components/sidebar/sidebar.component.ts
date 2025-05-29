import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  nomeInstituicao: string = 'Instituição';
  imagemBase64: string | null = null;
  idInstituicao: number | null = null;

  constructor(private router: Router, private toast: ToastrService) {}

  ngOnInit(): void {
    try {
      const instituicao = JSON.parse(sessionStorage.getItem('instituicao') || '{}');
      this.nomeInstituicao = instituicao.nomeInstituicao || 'Instituição';
      this.imagemBase64 = instituicao.imagemPerfil || instituicao.imagem || null;
      this.idInstituicao = instituicao.id || null;
    } catch (e) {
      this.toast.error('Erro ao carregar dados da instituição.');
      this.idInstituicao = null;
    }
  }

  sair(): void {
    sessionStorage.clear();
    this.toast.success('Você saiu com sucesso!');
    this.router.navigate(['/home']);
  }

  editarConta(): void {
    this.router.navigate(['/user']);
  }

  editarItens(): void {
    this.router.navigate(['/instituicao']);
  }

  editarCampanha(): void {
    this.router.navigate(['/campanhas']);
  }

  verPaginaPublica(): void {
    if (this.idInstituicao && this.idInstituicao > 0) {
      this.router.navigate(['/instituicoes', this.idInstituicao]);
    } else {
      this.toast.error('Instituição não encontrada. Faça login novamente.');
      this.router.navigate(['/login']);
    }
  }

  verPaginaCampanha(): void {
    if (this.idInstituicao && this.idInstituicao > 0) {
      this.router.navigate(['/campanhas', this.idInstituicao], {
      });
    } else {
      this.toast.error('Campanha não encontrada. Verifique o cadastro.');
      this.router.navigate(['/campanhas']);
    }
  }

  voltar(): void {
    window.history.back();
  }

  voltarParaHome(): void {
    this.router.navigate(['/home']);
  }


}
