// import { Injectable } from '@angular/core';
// import { HttpClient } from "@angular/common/http";
// import { LoginResponse } from "../types/login-response.type";
// import { tap } from "rxjs";
//
// @Injectable({
//   providedIn: 'root'
// })
// export class LoginService {
//
//   private readonly apiUrl = "http://localhost:8080/instituicoes";
//
//   constructor(private httpClient: HttpClient) { }
//
//   login(email: string, senha: string) {
//     return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, { email, senha }).pipe(
//       tap((value) => {
//         sessionStorage.setItem("auth-token", value.token);
//         sessionStorage.setItem("email", value.email);
//       })
//     );
//   }
//
//   cadastro(
//     nomeInstituicao: string,
//     email: string,
//     senha: string,
//     cnpj: string,
//     endereco: string,
//     telefone: string,
//     categoria: string
//   ) {
//     return this.httpClient.post<LoginResponse>(`${this.apiUrl}/cadastro`, {
//       nomeInstituicao,
//       email,
//       senha,
//       cnpj,
//       endereco,
//       telefone,
//       categoria
//     }).pipe(
//       tap((value) => {
//         sessionStorage.setItem("auth-token", value.token);
//         sessionStorage.setItem("email", value.email);
//       })
//     );
//   }
//
//
//   //Vou usar ainda nao sei
//   verificarCnpj(cnpj: string) {
//     return this.httpClient.post(`${this.apiUrl}/validar-cnpj`, { cnpj });
//   }
// }
//
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { LoginResponse } from "../types/login-response.type";
import { tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly apiUrl = "http://localhost:8080/instituicoes";

  constructor(private httpClient: HttpClient) { }

  // Faz login tanto para Instituicoes quanto para Admin
  login(email: string, senha: string) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/login`, { email, senha }).pipe(
      tap((value) => {
        // Salva token no sessionStorage
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("email", value.email);

        // Salva o tipo de usuário (INSTITUICAO ou ADMIN)
        sessionStorage.setItem("tipoUsuario", value.tipoUsuario);
      })
    );
  }

  // Realiza cadastro de Instituicao
  cadastro(
    nomeInstituicao: string,
    email: string,
    senha: string,
    cnpj: string,
    endereco: string,
    telefone: string,
    categoria: string
  ) {
    return this.httpClient.post<LoginResponse>(`${this.apiUrl}/cadastro`, {
      nomeInstituicao,
      email,
      senha,
      cnpj,
      endereco,
      telefone,
      categoria
    }).pipe(
      tap((value) => {
        // Salva dados no sessionStorage
        sessionStorage.setItem("auth-token", value.token);
        sessionStorage.setItem("email", value.email);

        // Cadastro sempre é de Instituição
        sessionStorage.setItem("tipoUsuario", "INSTITUICAO");
      })
    );
  }

  // Verifica se o CNPJ é válido
  verificarCnpj(cnpj: string) {
    return this.httpClient.post(`${this.apiUrl}/validar-cnpj`, { cnpj });
  }
}
