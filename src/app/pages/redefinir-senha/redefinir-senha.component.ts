import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.scss']
})
export class RedefinirSenhaComponent implements OnInit {
  form!: FormGroup;
  token!: string;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    this.form = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmaSenha: ['', Validators.required]
    }, {
      validators: this.senhasIguaisValidator
    });
  }

  senhasIguaisValidator(group: FormGroup) {
    return group.get('novaSenha')?.value === group.get('confirmaSenha')?.value
      ? null : { senhasDiferentes: true };
  }

  redefinirSenha() {
    if (this.form.invalid) return;

    const body = {
      token: this.token,
      novaSenha: this.form.value.novaSenha
    };

    this.http.post('http://localhost:8080/recuperacao/redefinir', body)
      .subscribe({
        next: () => {
          this.toastr.success('Senha redefinida com sucesso!');
          this.router.navigate(['/login']);
        },
        error: err => {
          const mensagem = err.error?.mensagem || err.error || 'Erro ao redefinir senha.';
          this.toastr.error(mensagem);
        }
      });
  }
}
