// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';
//
// @Injectable({
//   providedIn: 'root'
// })
// export class InstituicaoService {
//   private readonly API = 'http://localhost:8080';
//
//   constructor(private http: HttpClient) {}
//
//   getCategorias(): Observable<string[]> {
//     return this.http.get<string[]>(`${this.API}/instituicoes/categorias`);
//   }
//
//   getInstituicao(id: string): Observable<any> {
//     return this.http.get(`${this.API}/instituicoes/publico/${id}`);
//   }
//
//   getItensDaInstituicao(id: string): Observable<any[]> {
//     return this.http.get<any[]>(`${this.API}/lista/instituicao/${id}`);
//   }
// }
//
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InstituicaoService {
  private readonly API = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  // Busca as categorias disponíveis para o formulário de cadastro
  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API}/instituicoes/categorias`);
  }

  // Busca dados públicos de uma instituição pelo ID
  getInstituicao(id: string): Observable<any> {
    return this.http.get<any>(`${this.API}/instituicoes/publico/${id}`);
  }

  // Busca a lista de itens de uma instituição específica
  getItensDaInstituicao(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/lista/instituicao/${id}`);
  }

  // Valida o CNPJ (caso queira usar por fora do componente também)
  validarCnpj(cnpj: string): Observable<any> {
    return this.http.post(`${this.API}/instituicoes/validar-cnpj`, { cnpj });
  }
}
