import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InstituicaoService } from '../../services/instituicao.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  categorias: string[] = [];

  imagemSelecionada!: File;
  imagemBase64: string = '';

  mostrarModalSenha = false;
  senhaConfirmacao: string = '';
  tipoAcao: 'editar' | 'excluir' | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private instituicaoService: InstituicaoService
  ) {}

  ngOnInit() {
    this.id = sessionStorage.getItem('id')!;

    this.form = this.fb.group({
      nomeInstituicao: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cnpj: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      categoria: ['']
    });

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    this.http.get<any>(`http://localhost:8080/instituicoes/${this.id}`, { headers })
      .subscribe(data => {
        this.form.patchValue(data);
        this.imagemBase64 = data.imagemPerfil; // <- pega imagem do banco
      });

    this.instituicaoService.getCategorias().subscribe(categorias => {
      this.categorias = categorias;
    });
  }

  selecionarImagem(event: any) {
    this.imagemSelecionada = event.target.files[0];
  }

  enviarImagem() {
    if (!this.imagemSelecionada) {
      alert('Selecione uma imagem antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('imagem', this.imagemSelecionada);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, formData, { headers })
      .subscribe(() => {
        alert('Imagem atualizada com sucesso!');
        const reader = new FileReader();
        reader.onload = () => {
          this.imagemBase64 = (reader.result as string).split(',')[1];
        };
        reader.readAsDataURL(this.imagemSelecionada);
      }, err => {
        alert('Erro ao enviar imagem.');
      });
  }

  abrirModalSenha(tipo: 'editar' | 'excluir') {
    this.tipoAcao = tipo;
    this.senhaConfirmacao = '';
    this.mostrarModalSenha = true;
  }

  cancelarModal() {
    this.tipoAcao = null;
    this.senhaConfirmacao = '';
    this.mostrarModalSenha = false;
  }

  confirmarSenha() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    if (this.tipoAcao === 'editar') {
      const payload = {
        nomeInstituicao: this.form.value.nomeInstituicao,
        email: this.form.value.email,
        telefone: this.form.value.telefone,
        endereco: this.form.value.endereco,
        categoria: this.form.value.categoria,
        senhaAtual: this.senhaConfirmacao
      };

      this.http.put(`http://localhost:8080/instituicoes/${this.id}`, payload, { headers })
        .subscribe(() => {
          alert('Dados atualizados com sucesso!');
          this.cancelarModal();
        }, err => {
          alert('Erro ao atualizar: ' + err.error);
        });

    } else if (this.tipoAcao === 'excluir') {
      this.http.delete(`http://localhost:8080/instituicoes/${this.id}`, {
        headers,
        body: { senha: this.senhaConfirmacao }
      }).subscribe(() => {
        sessionStorage.clear();
        alert('Conta excluída com sucesso!');
        this.router.navigate(['/login']);
        this.cancelarModal();
      }, err => {
        alert('Erro ao excluir: ' + err.error);
      });
    }
  }

  irParaAlterarSenha() {
    this.router.navigate(['/alterar-senha']);
  }
}
