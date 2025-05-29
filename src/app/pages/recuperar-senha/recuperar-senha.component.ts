// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';
//
// @Component({
//   selector: 'app-recuperar-senha',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './recuperar-senha.component.html',
//   styleUrls: ['./recuperar-senha.component.scss']
// })
// export class RecuperarSenhaComponent {
//   form!: FormGroup;
//
//   constructor(
//     private fb: FormBuilder,
//     private http: HttpClient,
//     private router: Router,
//     private toastr: ToastrService
//   ) {
//     this.form = this.fb.group({
//       email: ['', [Validators.required, Validators.email]]
//     });
//   }
//
//   enviar() {
//     if (this.form.invalid) return;
//
//     this.http.post('http://localhost:8080/recuperacao/solicitar', this.form.value)
//       .subscribe({
//         next: () => {
//           this.toastr.success('Instruções enviadas para o email informado.');
//           this.router.navigate(['/login']);
//         },
//         // error: (err) => {
//         //   if (![404, 500].includes(err.status)) {
//         //     this.toastr.error(err.error || 'Erro ao solicitar recuperação.');
//         //   }
//         // }
//       });
//   }
//
//   voltar() {
//     this.router.navigate(['/login']);
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DefaultLoginLayoutComponent } from '../../components/default-login-layout/default-login-layout.component';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DefaultLoginLayoutComponent
  ],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviar() {
    if (this.form.invalid) return;

    this.http.post('http://localhost:8080/recuperacao/solicitar', this.form.value)
      .subscribe({
        next: () => {
          this.toastr.success('Instruções enviadas para o email informado.');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastr.error(err.error || 'Erro ao solicitar recuperação.');
        }
      });
  }

  voltar() {
    this.router.navigate(['/login']);
  }
}
