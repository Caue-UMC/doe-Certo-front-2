import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer-component/footer.component';
import { HeaderComponent } from '../../components/header-component/header.component';

@Component({
  selector: 'app-instituicoes-public',
  templateUrl: './instituicoes-public.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    FooterComponent,
    HeaderComponent,
  ],
  styleUrls: ['./instituicoes-public.component.scss']
})
export class InstituicoesPublicComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef;

  instituicoes: any[] = [];
  categorias: string[] = [];
  categoriasBonitas: { label: string, value: string }[] = [];
  estados: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
    'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
    'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  filtros = {
    nome: '',
    cidade: '',
    uf: '',
    categoria: ''
  };

  sugestoesNome: string[] = [];
  sugestoesCidade: string[] = [];
  nenhumNome = false;
  nenhumaCidade = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.buscarInstituicoes();
    this.carregarCategorias();
  }

  scrollCarousel(direction: number) {
    const el = this.carousel?.nativeElement;
    const scrollAmount = 300;
    if (el) {
      el.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  }

  buscarInstituicoes() {
    let params = new HttpParams();

    if (this.filtros.nome) params = params.set('nome', this.filtros.nome.trim());
    if (this.filtros.cidade) params = params.set('cidade', this.filtros.cidade.trim());
    if (this.filtros.uf) params = params.set('estado', this.filtros.uf.trim().toUpperCase());
    if (this.filtros.categoria) params = params.set('categoria', this.filtros.categoria);

    this.http.get<any>('http://localhost:8080/instituicoes/publico', { params })
      .subscribe(res => this.instituicoes = res.content);
  }

  carregarCategorias() {
    this.http.get<string[]>('http://localhost:8080/instituicoes/categorias')
      .subscribe(res => {
        this.categorias = res;
        this.categoriasBonitas = res.map(cat => ({
          label: cat.charAt(0) + cat.slice(1).toLowerCase(),
          value: cat
        }));
      });
  }

  buscarPorNome() {
    const nome = this.filtros.nome.trim();
    if (!nome) {
      this.sugestoesNome = [];
      this.nenhumNome = false;
      return;
    }

    this.http.get<any>(`http://localhost:8080/instituicoes/publico?nome=${nome}`).subscribe({
      next: res => {
        const lista = res.content.map((i: any) => String(i.nomeInstituicao));
        this.sugestoesNome = [...new Set(lista)] as string[];
        this.nenhumNome = this.sugestoesNome.length === 0;
      },
      error: () => {
        this.sugestoesNome = [];
        this.nenhumNome = true;
      }
    });
  }

  selecionarNome(nome: string) {
    this.filtros.nome = nome;
    this.sugestoesNome = [];
    this.nenhumNome = false;
  }

  buscarPorCidade() {
    const cidade = this.filtros.cidade.trim();
    if (!cidade) {
      this.sugestoesCidade = [];
      this.nenhumaCidade = false;
      return;
    }

    this.http.get<any>(`http://localhost:8080/instituicoes/publico?cidade=${cidade}`).subscribe({
      next: res => {
        const lista = res.content.map((i: any) => String(i.endereco.cidade));
        this.sugestoesCidade = [...new Set(lista)] as string[];
        this.nenhumaCidade = this.sugestoesCidade.length === 0;
      },
      error: () => {
        this.sugestoesCidade = [];
        this.nenhumaCidade = true;
      }
    });
  }

  selecionarCidade(cidade: string) {
    this.filtros.cidade = cidade;
    this.sugestoesCidade = [];
    this.nenhumaCidade = false;
  }

  fecharSugestoes(campo: 'uf' | 'nome' | 'cidade') {
    setTimeout(() => {
      if (campo === 'nome') this.sugestoesNome = [];
      if (campo === 'cidade') this.sugestoesCidade = [];
    }, 200);
  }

  verDetalhes(inst: any) {
    this.router.navigate(['/instituicoes', inst.idInstituicao]);
  }

  getImagem(base64: string) {
    return base64 ? `data:image/jpeg;base64,${base64}` : 'assets/svg/perfil-padrao.svg';
  }
}
