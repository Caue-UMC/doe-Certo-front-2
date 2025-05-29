import { Component } from '@angular/core';
import {FooterComponent} from "../../components/footer-component/footer.component";
import {HeaderComponent} from "../../components/header-component/header.component";

@Component({
  selector: 'app-como-funciona',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './como-funciona.component.html',
  styleUrl: './como-funciona.component.scss'
})
export class ComoFuncionaComponent {

}
