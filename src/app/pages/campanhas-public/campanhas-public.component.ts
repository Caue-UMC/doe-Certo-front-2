// import { Component, OnInit } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { HeaderComponent } from '../../components/header-component/header.component';
// import { FooterComponent } from '../../components/footer-component/footer.component';
//
// @Component({
//   selector: 'app-campanhas-public',
//   standalone: true,
//   templateUrl: './campanhas-public.component.html',
//   styleUrls: ['./campanhas-public.component.scss'],
//   imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
// })
// export class CampanhasPublicComponent implements OnInit {
//   campanhas: any[] = [];
//   estados: string[] = [
//     'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
//     'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
//     'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
//   ];
//
//   filtros = {
//     nome: '',
//     instituicao: '',
//     cidade: '',
//     uf: '',
//     status: ''
//   };
//
//   sugestoesNome: string[] = [];
//   sugestoesInstituicao: string[] = [];
//   sugestoesCidade: string[] = [];
//
//   nenhumNome = false;
//   nenhumaInstituicao = false;
//   nenhumaCidade = false;
//
//   constructor(private http: HttpClient, private router: Router) {}
//
//   ngOnInit() {
//     this.buscarCampanhas();
//   }
//
//   buscarCampanhas() {
//     let params = new HttpParams();
//
//     if (this.filtros.nome) params = params.set('nome', this.filtros.nome.trim());
//     if (this.filtros.instituicao) params = params.set('instituicao', this.filtros.instituicao.trim());
//     if (this.filtros.cidade) params = params.set('cidade', this.filtros.cidade.trim());
//     if (this.filtros.uf) params = params.set('estado', this.filtros.uf.trim().toUpperCase());
//     if (this.filtros.status) params = params.set('ativa', this.filtros.status === 'ATIVA');
//
//     this.http.get<any>('http://localhost:8080/campanhas/publico', { params })
//       .subscribe({
//         next: res => this.campanhas = res.content || [],
//         error: () => this.campanhas = []
//       });
//   }
//
//   buscarPorNome() {
//     const nome = this.filtros.nome.trim();
//     if (!nome) {
//       this.sugestoesNome = [];
//       this.nenhumNome = false;
//       return;
//     }
//
//     this.http.get<any>('http://localhost:8080/campanhas/publico?nome=' + nome).subscribe({
//       next: (res) => {
//         const lista = (res.content as any[]).map(c => String(c.nome));
//         this.sugestoesNome = [...new Set(lista)];
//         this.nenhumNome = this.sugestoesNome.length === 0;
//       },
//       error: () => {
//         this.sugestoesNome = [];
//         this.nenhumNome = true;
//       }
//     });
//   }
//
//   buscarPorInstituicao() {
//     const inst = this.filtros.instituicao.trim();
//     if (!inst) {
//       this.sugestoesInstituicao = [];
//       this.nenhumaInstituicao = false;
//       return;
//     }
//
//     this.http.get<any>('http://localhost:8080/campanhas/publico?instituicao=' + inst).subscribe({
//       next: (res) => {
//         const lista = (res.content as any[]).map(c => String(c.nomeInstituicao));
//         this.sugestoesInstituicao = [...new Set(lista)];
//         this.nenhumaInstituicao = this.sugestoesInstituicao.length === 0;
//       },
//       error: () => {
//         this.sugestoesInstituicao = [];
//         this.nenhumaInstituicao = true;
//       }
//     });
//   }
//
//   buscarPorCidade() {
//     const cidade = this.filtros.cidade.trim();
//     if (!cidade) {
//       this.sugestoesCidade = [];
//       this.nenhumaCidade = false;
//       return;
//     }
//
//     this.http.get<any>('http://localhost:8080/campanhas/publico?cidade=' + cidade).subscribe({
//       next: (res) => {
//         const lista = (res.content as any[]).map(c => String(c.cidade));
//         this.sugestoesCidade = [...new Set(lista)];
//         this.nenhumaCidade = this.sugestoesCidade.length === 0;
//       },
//       error: () => {
//         this.sugestoesCidade = [];
//         this.nenhumaCidade = true;
//       }
//     });
//   }
//
//   selecionarNome(nome: string) {
//     this.filtros.nome = nome;
//     this.sugestoesNome = [];
//     this.nenhumNome = false;
//   }
//
//   selecionarInstituicao(inst: string) {
//     this.filtros.instituicao = inst;
//     this.sugestoesInstituicao = [];
//     this.nenhumaInstituicao = false;
//   }
//
//   selecionarCidade(cidade: string) {
//     this.filtros.cidade = cidade;
//     this.sugestoesCidade = [];
//     this.nenhumaCidade = false;
//   }
//
//   fecharSugestoes(campo: 'nome' | 'instituicao' | 'cidade') {
//     setTimeout(() => {
//       if (campo === 'nome') this.sugestoesNome = [];
//       if (campo === 'instituicao') this.sugestoesInstituicao = [];
//       if (campo === 'cidade') this.sugestoesCidade = [];
//     }, 200);
//   }
//
//   verDetalhes(camp: any) {
//     this.router.navigate(['/campanhas', camp.id]);
//   }
//
//   getImagem(base64: string) {
//     return base64 ? `data:image/jpeg;base64,${base64}` : 'assets/png/imagem-campanha-padrao.png';
//   }
// }
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header-component/header.component';
import { FooterComponent } from '../../components/footer-component/footer.component';

@Component({
  selector: 'app-campanhas-public',
  standalone: true,
  templateUrl: './campanhas-public.component.html',
  styleUrls: ['./campanhas-public.component.scss'],
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent]
})
export class CampanhasPublicComponent implements OnInit {
  campanhas: any[] = [];
  estados: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  filtros = {
    nome: '',
    instituicao: '',
    cidade: '',
    uf: '',
    status: ''
  };

  sugestoesNome: string[] = [];
  sugestoesInstituicao: string[] = [];
  sugestoesCidade: string[] = [];

  nenhumNome = false;
  nenhumaInstituicao = false;
  nenhumaCidade = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.buscarCampanhas();
  }

  buscarCampanhas() {
    let params = new HttpParams();

    if (this.filtros.nome) params = params.set('nome', this.filtros.nome.trim());
    if (this.filtros.instituicao) params = params.set('instituicao', this.filtros.instituicao.trim());
    if (this.filtros.cidade) params = params.set('cidade', this.filtros.cidade.trim());
    if (this.filtros.uf) params = params.set('estado', this.filtros.uf.trim().toUpperCase());
    if (this.filtros.status) params = params.set('ativa', this.filtros.status === 'ATIVA');

    this.http.get<any>('http://localhost:8080/campanhas/publico', { params })
      .subscribe({
        next: res => this.campanhas = res.content || [],
        error: () => this.campanhas = []
      });
  }

  buscarPorNome() {
    const nome = this.filtros.nome.trim();
    if (!nome) {
      this.sugestoesNome = [];
      this.nenhumNome = false;
      return;
    }

    this.http.get<any>('http://localhost:8080/campanhas/publico?nome=' + nome).subscribe({
      next: (res) => {
        const lista = (res.content as any[]).map(c => String(c.nome));
        this.sugestoesNome = [...new Set(lista)];
        this.nenhumNome = this.sugestoesNome.length === 0;
      },
      error: () => {
        this.sugestoesNome = [];
        this.nenhumNome = true;
      }
    });
  }

  buscarPorInstituicao() {
    const inst = this.filtros.instituicao.trim();
    if (!inst) {
      this.sugestoesInstituicao = [];
      this.nenhumaInstituicao = false;
      return;
    }

    this.http.get<any>('http://localhost:8080/campanhas/publico?instituicao=' + inst).subscribe({
      next: (res) => {
        const lista = (res.content as any[]).map(c => String(c.nomeInstituicao));
        this.sugestoesInstituicao = [...new Set(lista)];
        this.nenhumaInstituicao = this.sugestoesInstituicao.length === 0;
      },
      error: () => {
        this.sugestoesInstituicao = [];
        this.nenhumaInstituicao = true;
      }
    });
  }

  buscarPorCidade() {
    const cidade = this.filtros.cidade.trim();
    if (!cidade) {
      this.sugestoesCidade = [];
      this.nenhumaCidade = false;
      return;
    }

    this.http.get<any>('http://localhost:8080/campanhas/publico?cidade=' + cidade).subscribe({
      next: (res) => {
        const lista = (res.content as any[]).map(c => String(c.cidade || c.endereco?.cidade || ''));
        this.sugestoesCidade = [...new Set(lista.filter(c => c))];
        this.nenhumaCidade = this.sugestoesCidade.length === 0;
      },
      error: () => {
        this.sugestoesCidade = [];
        this.nenhumaCidade = true;
      }
    });
  }

  selecionarNome(nome: string) {
    this.filtros.nome = nome;
    this.sugestoesNome = [];
    this.nenhumNome = false;
  }

  selecionarInstituicao(inst: string) {
    this.filtros.instituicao = inst;
    this.sugestoesInstituicao = [];
    this.nenhumaInstituicao = false;
  }

  selecionarCidade(cidade: string) {
    this.filtros.cidade = cidade;
    this.sugestoesCidade = [];
    this.nenhumaCidade = false;
  }

  fecharSugestoes(campo: 'nome' | 'instituicao' | 'cidade') {
    setTimeout(() => {
      if (campo === 'nome') this.sugestoesNome = [];
      if (campo === 'instituicao') this.sugestoesInstituicao = [];
      if (campo === 'cidade') this.sugestoesCidade = [];
    }, 200);
  }

  verDetalhes(camp: any) {
    this.router.navigate(['/campanhas', camp.id]);
  }

  getImagem(base64: string) {
    return base64 ? `data:image/jpeg;base64,${base64}` : 'assets/png/imagem-campanha-padrao.png';
  }
}
