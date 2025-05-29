import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sidebar-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent implements OnInit {
  nomeAdmin: string = 'Administrador';
  imagemAdmin: string = '/assets/png/adm-padrao-icon.png';

  constructor(private router: Router, private toast: ToastrService) {}

  ngOnInit(): void {
    try {
      const admin = JSON.parse(sessionStorage.getItem('admin') || '{}');
      this.nomeAdmin = admin.nome && admin.nome.trim() !== '' ? admin.nome : 'Administrador';
    } catch (e) {
      this.nomeAdmin = 'Administrador';
    }
  }

  sair(): void {
    sessionStorage.clear();
    this.toast.success('Você saiu com sucesso!');
    this.router.navigate(['/home']);
  }

  voltar(): void {
    window.history.back();
  }

  voltarParaHome(): void {
    this.router.navigate(['/home']);
  }

  verGraficos(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  gerenciarInstituicoes(): void {
    this.router.navigate(['/admin/instituicoes']);
  }
}
