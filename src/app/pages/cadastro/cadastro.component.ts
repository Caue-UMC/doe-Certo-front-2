import {DefaultLoginLayoutComponent} from "../../components/default-login-layout/default-login-layout.component";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PrimaryInputComponent} from "../../components/primary-input/primary-input.component";
import {Router} from "@angular/router";
import {LoginService} from "../../services/login.service";
import {ToastrService} from "ngx-toastr";
import {Component} from "@angular/core";
import { CommonModule } from '@angular/common';

interface CadastroForm{
  email: FormControl;
  cnpj: FormControl;
  nomeInstituicao: FormControl;
  categoria: FormControl;
  endereco: FormControl;
  telefone: FormControl;
  senha: FormControl;
  confirmaSenha: FormControl;
}

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    DefaultLoginLayoutComponent,
    ReactiveFormsModule,
    PrimaryInputComponent,
    CommonModule
  ],
  providers: [LoginService],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  cadastroForm!: FormGroup<CadastroForm>;

  constructor(
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastrService
  ) {
    this.cadastroForm = new FormGroup({
      email: new FormControl('', [Validators.required]), //Validators.email,
      cnpj: new FormControl('', [Validators.required]),// Validators.minLength(11),
      nomeInstituicao: new FormControl('', [Validators.required]),//Validators.minLength(6),
      categoria: new FormControl('', [Validators.required]),
      endereco: new FormControl('', [Validators.required]),//Validators.minLength(6),
      telefone: new FormControl('', [Validators.required]),//minLength(9),
      senha: new FormControl('', [Validators.required]),//Validators.minLength(6),
      confirmaSenha: new FormControl('', [Validators.required])//Validators.minLength(6),
    })
  }

  submit(){
    this.loginService.cadastro(this.cadastroForm.value.nomeInstituicao, this.cadastroForm.value.email, this.cadastroForm.value.senha, this.cadastroForm.value.cnpj, this.cadastroForm.value.endereco, this.cadastroForm.value.telefone, this.cadastroForm.value.categoria).subscribe({
      next:() => this.toastService.success("Cadastro realizado com sucesso"),
      error:() => this.toastService.error("Erro inesperado! Tente novamente mais tarde.")
    })
  }

  navigate(){
    this.router.navigate(["/login"])
  }
}
