import { Component } from '@angular/core';
import {HeaderComponent} from "../../components/header-component/header.component";
import {FooterComponent} from "../../components/footer-component/footer.component";

@Component({
  selector: 'app-politica-privacidade',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './politica-privacidade.component.html',
  styleUrl: './politica-privacidade.component.scss'
})
export class PoliticaPrivacidadeComponent {

}
