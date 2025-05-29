import { Component } from '@angular/core';
import {HeaderComponent} from "../../components/header-component/header.component";
import {FooterComponent} from "../../components/footer-component/footer.component";

@Component({
  selector: 'app-quem-somos',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './quem-somos.component.html',
  styleUrl: './quem-somos.component.scss'
})
export class QuemSomosComponent {

}
