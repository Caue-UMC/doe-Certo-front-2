import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgClass, CommonModule } from '@angular/common';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    CommonModule,
    NgxMaskDirective,
    SidebarComponent,
  ],
  styleUrls: ['./user.component.scss'],
  providers: [provideNgxMask()]
})
export class UserComponent implements OnInit {
  form!: FormGroup;
  imagemBase64: string | null = null;
  imagemArquivo: File | null = null;
  categorias: string[] = [];
  ufs: string[] = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
  mostrarModalSenha = false;
  senhaConfirmacao = '';
  tipoAcao: 'editar' | 'excluir' | null = null;
  id!: string;
  cepOriginal: any = null;
  enderecoInicial: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.id = sessionStorage.getItem('id')!;

    this.form = this.fb.group({
      nomeInstituicao: ['', Validators.required],
      telefone: ['', Validators.required],
      cep: ['', Validators.required],
      rua: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      estado: ['', Validators.required],
      categoria: ['', Validators.required],
      historia: [''] // ✅ campo adicionado
    });

    this.carregarDados();
    this.carregarCategorias();
  }

  carregarDados() {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem('auth-token') });
    this.http.get<any>(`http://localhost:8080/instituicoes/${this.id}`, { headers }).subscribe((data) => {
      this.form.patchValue({
        nomeInstituicao: data.nomeInstituicao,
        telefone: data.telefone,
        cep: data.endereco.cep,
        rua: data.endereco.rua,
        numero: data.endereco.numero,
        complemento: data.endereco.complemento,
        bairro: data.endereco.bairro,
        cidade: data.endereco.cidade,
        estado: data.endereco.uf,
        categoria: data.categoria,
        historia: data.historia || '' // ✅ preenchendo campo
      });
      this.enderecoInicial = data.endereco;
      this.imagemBase64 = data.imagemPerfil;
    });
  }

  carregarCategorias() {
    this.http.get<string[]>(`http://localhost:8080/instituicoes/categorias`).subscribe((cats) => {
      this.categorias = cats;
    });
  }

  aoDigitarCep() {
    const cep = this.form.get('cep')?.value.replace(/\D/g, '');
    if (cep.length === 8) {
      this.http.get<any>(`https://viacep.com.br/ws/${cep}/json/`).subscribe(res => {
        if (res.erro) {
          this.toastr.clear();
          this.toastr.error('CEP não encontrado');
        } else {
          this.cepOriginal = res;
          this.form.patchValue({
            rua: res.logradouro,
            bairro: res.bairro,
            cidade: res.localidade,
            estado: res.uf
          });
        }
      });
    }
  }

  abrirModalSenha(tipo: 'editar' | 'excluir') {
    this.tipoAcao = tipo;
    this.mostrarModalSenha = true;
  }

  cancelarModal() {
    this.mostrarModalSenha = false;
    this.senhaConfirmacao = '';
  }

  confirmarSenha() {
    if (!this.senhaConfirmacao) {
      this.toastr.clear();
      this.toastr.error('Senha obrigatória.');
      return;
    }
    if (this.tipoAcao === 'editar') {
      this.salvar();
    } else if (this.tipoAcao === 'excluir') {
      this.excluirConta();
    }
  }

  salvar() {
    if (!this.form.valid) {
      this.toastr.clear();
      this.toastr.error('Preencha os campos obrigatórios.');
      return;
    }

    const cepLimpo = this.form.value.cep.replace(/\D/g, '');

    const enderecoAtual = {
      cep: cepLimpo,
      rua: this.form.value.rua,
      numero: this.form.value.numero,
      complemento: this.form.value.complemento,
      bairro: this.form.value.bairro,
      cidade: this.form.value.cidade,
      uf: this.form.value.estado
    };

    const enderecoAlterado = (
      enderecoAtual.cep !== this.enderecoInicial?.cep?.replace(/\D/g, '') ||
      enderecoAtual.rua !== this.enderecoInicial?.rua ||
      enderecoAtual.numero !== this.enderecoInicial?.numero ||
      enderecoAtual.complemento !== this.enderecoInicial?.complemento ||
      enderecoAtual.bairro !== this.enderecoInicial?.bairro ||
      enderecoAtual.cidade !== this.enderecoInicial?.cidade ||
      enderecoAtual.uf !== this.enderecoInicial?.uf
    );

    if (enderecoAlterado && (!cepLimpo || cepLimpo.length !== 8)) {
      this.toastr.clear();
      this.toastr.error('CEP inválido ou incompleto.');
      return;
    }

    const continuar = () => {
      if (enderecoAlterado && this.cepOriginal) {
        const cidade = enderecoAtual.cidade?.trim().toLowerCase();
        const estado = enderecoAtual.uf?.trim().toUpperCase();
        const cidadeCep = this.cepOriginal?.localidade?.trim().toLowerCase();
        const estadoCep = this.cepOriginal?.uf?.trim().toUpperCase();

        if (cidade !== cidadeCep || estado !== estadoCep) {
          this.toastr.clear();
          this.toastr.error('Cidade ou estado não correspondem ao CEP informado.');
          return;
        }
      }

      const body = {
        ...this.form.value,
        endereco: enderecoAtual,
        senhaAtual: this.senhaConfirmacao
      };

      const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem('auth-token') });

      this.http.put(`http://localhost:8080/instituicoes/${this.id}`, body, { headers }).subscribe(() => {
        this.toastr.success('Dados atualizados com sucesso!');
        this.cancelarModal();
        this.atualizarSessionStorage();
      }, err => {
        this.toastr.clear();
        if (err.status === 400 && typeof err.error === 'string') {
          this.toastr.error(err.error);
        } else {
          this.toastr.error('Erro ao atualizar.');
        }
      });
    };

    if (enderecoAlterado && !this.cepOriginal) {
      this.http.get<any>(`https://viacep.com.br/ws/${cepLimpo}/json/`).subscribe(res => {
        if (res.erro) {
          this.toastr.clear();
          this.toastr.error('CEP não encontrado');
          return;
        }
        this.cepOriginal = res;
        continuar();
      }, () => {
        this.toastr.clear();
        this.toastr.error('Erro ao validar o CEP.');
      });
    } else {
      continuar();
    }
  }
  excluirConta() {
    if (!this.senhaConfirmacao) {
      this.toastr.clear();
      this.toastr.error('Senha obrigatória.');
      return;
    }

    const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem('auth-token') });
    const body = { senha: this.senhaConfirmacao };

    this.http.request('delete', `http://localhost:8080/instituicoes/${this.id}`, {
      headers,
      body
    }).subscribe(() => {
      this.toastr.success('Conta excluída com sucesso');
      sessionStorage.clear();
      this.router.navigate(['/login']);
    }, err => {
      this.toastr.clear();
      if (err.status === 400 && typeof err.error === 'string') {
        this.toastr.error(err.error); // Mostra mensagem do back (ex: "Não é possível excluir enquanto houver campanhas ou listas")
      } else {
        this.toastr.error('Erro ao excluir conta');
      }
    });
  }

  irParaAlterarSenha() {
    this.router.navigate(['/alterar-senha']);
  }

  selecionarImagem(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imagemArquivo = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagemBase64 = (reader.result as string).split(',')[1];
      };
      reader.readAsDataURL(file);
    }
  }

  enviarImagem() {
    if (!this.imagemArquivo) return;
    const formData = new FormData();
    formData.append('imagem', this.imagemArquivo);
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem('auth-token') });
    this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, formData, { headers }).subscribe(() => {
      this.toastr.success('Imagem atualizada com sucesso!');
      this.atualizarSessionStorage();
    }, () => {
      this.toastr.error('Erro ao enviar imagem.');
    });
  }

  removerImagem() {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem('auth-token') });
    this.http.put(`http://localhost:8080/instituicoes/${this.id}/imagem`, {}, { headers }).subscribe(() => {
      this.imagemBase64 = null;
      this.imagemArquivo = null;
      this.toastr.success('Imagem removida com sucesso!');
      this.atualizarSessionStorage();
    }, () => {
      this.toastr.error('Erro ao remover imagem.');
    });
  }

  atualizarSessionStorage(): void {
    const headers = new HttpHeaders({ Authorization: 'Bearer ' + sessionStorage.getItem('auth-token') });
    this.http.get<any>(`http://localhost:8080/instituicoes/${this.id}`, { headers }).subscribe((data) => {
      sessionStorage.setItem('instituicao', JSON.stringify(data));
    });
  }
}
