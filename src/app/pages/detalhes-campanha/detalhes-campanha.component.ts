import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../components/header-component/header.component';
import { FooterComponent } from '../../components/footer-component/footer.component';

@Component({
  selector: 'app-detalhes-campanha',
  templateUrl: './detalhes-campanha.component.html',
  styleUrls: ['./detalhes-campanha.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent]
})
export class DetalhesCampanhaComponent implements OnInit {
  campanha: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.carregarCampanha(id);
    }
  }

  carregarCampanha(id: string) {
    this.http.get<any>(`http://localhost:8080/campanhas/publico/${id}`).subscribe({
      next: data => this.campanha = data,
      error: err => console.error('Erro ao buscar detalhes da campanha', err)
    });
  }

  getImagemCampanha(imagem: string | null): string {
    return imagem ? `data:image/jpeg;base64,${imagem}` : 'assets/png/imagem-campanha-padrao.png';
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
}
