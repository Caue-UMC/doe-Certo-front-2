// instituicao.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const id = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('auth-token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<any>(`http://localhost:8080/instituicoes/${id}`, { headers })
      .subscribe(data => {
        this.nomeInstituicao = data.nomeInstituicao;
        this.imagemBase64 = data.imagemPerfil;
      });

    this.http.get<any[]>(`http://localhost:8080/lista/instituicao/${id}`, { headers })
      .subscribe(data => {
        this.produtos = data;
      });

    this.http.get<string[]>(`http://localhost:8080/lista/status`, { headers })
      .subscribe(status => {
        this.statusOptions = status;
      });
  }

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
      status: this.novoItem.status,
      idInstituicao: id
    };

    this.http.post(`http://localhost:8080/lista`, payload, { headers })
      .subscribe(() => {
        alert('Item cadastrado com sucesso!');
        this.fecharModal();
        this.ngOnInit();
      });
  }

  editarConta() {
    this.router.navigate(['/user']);
  }
}
