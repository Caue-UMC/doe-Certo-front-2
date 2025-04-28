import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService {

  private readonly API = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Buscar as categorias no back
  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API}/instituicoes/categorias`);
  }

}
