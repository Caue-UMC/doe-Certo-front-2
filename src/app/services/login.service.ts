import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {LoginResponse} from "../types/login-response.type";
import {tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoginService {

    apiUrl: string ="http://localhost:8080/instituicoes"

  constructor(private httpsClient: HttpClient) { }

    login(email: string, senha: string){
        return this.httpsClient.post<LoginResponse>(this.apiUrl + "/login", {email, senha}).pipe(
          tap((value) => {
            sessionStorage.setItem("auth-token", value.token)
            sessionStorage.setItem("email", value.email)
          })
        )
    }

    cadastro(nomeInstituicao: string, email: string, senha: string, cnpj: string, endereco: string, telefone: string, categoria: string) {
        return this.httpsClient.post<LoginResponse>(this.apiUrl + "/cadastro", {nomeInstituicao, email, senha, cnpj, endereco, telefone, categoria }).pipe(
          tap((value) => {
            sessionStorage.setItem("auth-token", value.token)
            sessionStorage.setItem("email", value.email)
          })
        )
    }

}


