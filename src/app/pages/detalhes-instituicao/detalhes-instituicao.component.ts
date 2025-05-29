import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { InstituicaoService } from '../../services/instituicao.service';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../../components/footer-component/footer.component';
import { HeaderComponent } from '../../components/header-component/header.component';

@Component({
  selector: 'app-detalhes-instituicao',
  templateUrl: './detalhes-instituicao.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FooterComponent, HeaderComponent],
  styleUrls: ['./detalhes-instituicao.component.scss']
})
export class DetalhesInstituicaoComponent implements OnInit {
  instituicao: any;
  itens: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private instituicaoService: InstituicaoService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.instituicaoService.getInstituicao(id).subscribe({
        next: data => this.instituicao = data,
        error: err => console.error('Erro ao buscar instituição', err)
      });

      this.instituicaoService.getItensDaInstituicao(id).subscribe({
        next: data => this.itens = data,
        error: err => console.error('Erro ao buscar itens da instituição', err)
      });
    }
  }

  getImagem(imagem: string | null): string {
    return imagem ? `data:image/jpeg;base64,${imagem}` : 'assets/svg/perfil-padrao.svg';
  }

  formatarTelefone(telefone: string): string {
    if (!telefone) return '';
    const digits = telefone.replace(/\D/g, '');
    if (digits.length === 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length === 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return telefone;
  }

  formatarCategoria(categoria: string): string {
    if (!categoria) return '';
    return categoria.charAt(0).toUpperCase() + categoria.slice(1).toLowerCase();
  }
}
