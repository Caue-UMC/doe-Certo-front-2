import { Component } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common'; // ⬅️ IMPORTANTE!

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem("auth-token");
  }

  logout() {
    fetch("http://localhost:8080/sair", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("auth-token")
      }
    }).then(() => {
      sessionStorage.removeItem("auth-token");
      this.router.navigate(['/login']);
    });
  }
}
