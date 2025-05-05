import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InstituicaoService } from '../../services/instituicao.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
    private instituicaoService: InstituicaoService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.id = sessionStorage.getItem('id')!;

    this.form = this.fb.group({
      nomeInstituicao: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cnpj: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      categoria: ['', Validators.required]
    });

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    this.http.get<any>(`http://localhost:8080/instituicoes/${this.id}`, { headers })
      .subscribe(data => {
        this.form.patchValue(data);
        this.imagemBase64 = data.imagemPerfil;
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
      this.toastr.error('Selecione uma imagem antes de enviar.');
      return;
    }

    const formData = new FormData();
    formData.append('imagem', this.imagemSelecionada);

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, formData, { headers })
      .subscribe(() => {
        this.toastr.success('Imagem atualizada com sucesso!');
        const reader = new FileReader();
        reader.onload = () => {
          this.imagemBase64 = (reader.result as string).split(',')[1];
        };
        reader.readAsDataURL(this.imagemSelecionada);
      }, err => {
        this.toastr.error('Erro ao enviar imagem.');
      });
  }

  removerImagem() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, {}, { headers })
      .subscribe(() => {
        this.imagemBase64 = '';
        this.toastr.success('Imagem removida com sucesso!');
      }, err => {
        this.toastr.error('Erro ao remover imagem.');
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
    if (this.form.invalid) {
      this.toastr.warning('Preencha todos os campos corretamente.');
      return;
    }

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
          this.toastr.success('Dados atualizados com sucesso!');
          this.cancelarModal();
        }, err => {
          this.toastr.error(err.error || 'Erro ao atualizar dados.');
        });

    } else if (this.tipoAcao === 'excluir') {
      this.http.delete(`http://localhost:8080/instituicoes/${this.id}`, {
        headers,
        body: { senha: this.senhaConfirmacao }
      }).subscribe(() => {
        sessionStorage.clear();
        this.toastr.success('Conta excluída com sucesso!');
        this.router.navigate(['/login']);
        this.cancelarModal();
      }, err => {
        this.toastr.error(err.error || 'Erro ao excluir conta.');
      });
    }
  }

  irParaAlterarSenha() {
    this.router.navigate(['/alterar-senha']);
  }
}
