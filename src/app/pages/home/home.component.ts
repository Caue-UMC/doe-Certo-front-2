import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { HeaderComponent } from '../../components/header-component/header.component';
import { FooterComponent } from '../../components/footer-component/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    NgIf,
    NgFor,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  instituicoesDestaque: any[] = [];
  private rafId: number | null = null;

  @ViewChild('carouselContainer') carouselContainer!: ElementRef;

  constructor(
    private router: Router,
    private http: HttpClient,
    private toast: ToastrService
  ) {}

  ngOnInit(): void {
    this.http.get<any>('http://localhost:8080/instituicoes/publico').subscribe({
      next: res => {
        const lista = res.content || [];
        const embaralhada = this.shuffleArray(lista);
        this.instituicoesDestaque = [...embaralhada, ...embaralhada];
      },
      error: () => {
        this.toast.error('Erro ao carregar destaques.');
      }
    });
  }

  ngAfterViewInit(): void {
    this.iniciarAutoplay();
  }

  ngOnDestroy(): void {
    this.pausarAutoplay();
  }

  iniciarAutoplay() {
    this.pausarAutoplay();
    const container = this.carouselContainer?.nativeElement;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!container || !container.scrollWidth) {
        this.rafId = requestAnimationFrame(animate);
        return;
      }

      container.scrollLeft += scrollSpeed;

      const limite = container.scrollWidth / 2;
      if (container.scrollLeft >= limite) {
        container.scrollLeft = 0;
      }

      this.rafId = requestAnimationFrame(animate);
    };

    this.rafId = requestAnimationFrame(animate);
  }

  pausarAutoplay() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  shuffleArray(array: any[]): any[] {
    return [...array].sort(() => Math.random() - 0.5);
  }

  irParaInstituicao(id: number) {
    this.router.navigate(['/instituicoes', id]);
  }
}
