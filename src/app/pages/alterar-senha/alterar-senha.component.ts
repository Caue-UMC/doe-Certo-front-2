import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {SidebarComponent} from "../../components/sidebar/sidebar.component";


@Component({
  selector: 'app-alterar-senha',
  standalone: true,
    imports: [CommonModule, ReactiveFormsModule, SidebarComponent],
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.scss']
})
export class AlterarSenhaComponent implements OnInit {
  form!: FormGroup;
  id!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.id = sessionStorage.getItem('id')!;

    this.form = this.fb.group({
      senhaAtual: ['', Validators.required],
      novaSenha: ['', [Validators.required, Validators.minLength(3)]],
      confirmaNovaSenha: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(() => {
      this.validarSenhas();
    });
  }

  validarSenhas() {
    const novaSenha = this.form.get('novaSenha')?.value;
    const confirmaNovaSenha = this.form.get('confirmaNovaSenha')?.value;

    // Só faz a verificação se os dois campos estiverem preenchidos
    if (!novaSenha || !confirmaNovaSenha) {
      this.form.get('confirmaNovaSenha')?.setErrors(null);
      return;
    }

    if (novaSenha !== confirmaNovaSenha) {
      this.form.get('confirmaNovaSenha')?.setErrors({ senhasDiferentes: true });
    } else {
      this.form.get('confirmaNovaSenha')?.setErrors(null);
    }
  }

  alterarSenha() {
    if (this.form.invalid) {
      this.toastService.error("Preencha todos os campos corretamente!");
      return;
    }

    if (this.form.value.novaSenha !== this.form.value.confirmaNovaSenha) {
      this.toastService.error("As senhas não coincidem!");
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + sessionStorage.getItem('auth-token')
    });

    this.http.put(`http://localhost:8080/instituicoes/${this.id}/alterar-senha`, {
      senhaAtual: this.form.value.senhaAtual,
      novaSenha: this.form.value.novaSenha
    }, { headers }).subscribe({
      next: () => {
        this.toastService.success('Senha alterada com sucesso!');

        // Pequeno delay para aparecer a mensagem e só depois navegar
        setTimeout(() => {
          this.router.navigate(['/user']);
        }, 1500);
      },
    });
  }
  voltarParaUser() {
    this.router.navigate(['/user']);
  }
}

