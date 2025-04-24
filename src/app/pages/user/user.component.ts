// // import { Component } from '@angular/core';
// // import {CommonModule} from "@angular/common";
// // import {NavbarComponent} from "../../components/navbar/navbar.component";
// //
// // @Component({
// //   selector: 'app-user',
// //   standalone: true,
// //   imports: [CommonModule, NavbarComponent],
// //   templateUrl: './user.component.html',
// //   styleUrl: './user.component.scss'
// // })
// // export class UserComponent {
// //
// // }
//
// import { CommonModule } from '@angular/common';
// import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
// import {Component, OnInit} from "@angular/core";
// import {HttpClient} from "@angular/common/http";
// import {Router} from "@angular/router"; // ajuste o caminho se necessário
//
// @Component({
//   selector: 'app-user',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
//   templateUrl: './user.component.html',
//   styleUrls: ['./user.component.scss']
// })
// export class UserComponent implements OnInit {
//   form!: FormGroup;
//   id!: string;
//
//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router
//   ) {}
//
//   ngOnInit() {
//     this.id = sessionStorage.getItem('id')!;
//     this.form = this.fb.group({
//       nomeInstituicao: ['', Validators.required],
//       email: ['', [Validators.required, Validators.email]],
//       cnpj: ['', Validators.required],
//       telefone: ['', Validators.required],
//       endereco: ['', Validators.required],
//       categoria: ['']
//     });
//
//     this.http.get<any>(`http://localhost:8080/instituicoes/${this.id}`).subscribe(data => {
//       this.form.patchValue(data);
//     });
//   }
//
//   atualizar() {
//     this.http.put(`http://localhost:8080/instituicoes/${this.id}`, this.form.value).subscribe(() => {
//       alert('Dados atualizados com sucesso!');
//     });
//   }
//
//   excluir() {
//     if (confirm('Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.')) {
//       this.http.delete(`http://localhost:8080/instituicoes/${this.id}`).subscribe(() => {
//         sessionStorage.clear();
//         alert('Conta excluída com sucesso!');
//         this.router.navigate(['/login']);
//       });
//     }
//   }
// }
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  form!: FormGroup;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.id = sessionStorage.getItem('id')!;
    this.form = this.fb.group({
      nomeInstituicao: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cnpj: ['', Validators.required],
      telefone: ['', Validators.required],
      endereco: ['', Validators.required],
      categoria: ['']
    });

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    this.http.get<any>(`http://localhost:8080/instituicoes/${this.id}`, { headers })
      .subscribe(data => {
        this.form.patchValue(data);
      });
  }

  atualizar() {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    this.http.put(`http://localhost:8080/instituicoes/${this.id}`, this.form.value, { headers })
      .subscribe(() => {
        alert('Dados atualizados com sucesso!');
      });
  }

  excluir() {
    if (confirm('Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.')) {
      const headers = new HttpHeaders({
        'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
      });

      this.http.delete(`http://localhost:8080/instituicoes/${this.id}`, { headers })
        .subscribe(() => {
          sessionStorage.clear();
          alert('Conta excluída com sucesso!');
          this.router.navigate(['/login']);
        });
    }
  }
}
