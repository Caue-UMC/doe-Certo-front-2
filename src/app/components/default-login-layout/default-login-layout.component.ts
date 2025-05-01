// import { Component, EventEmitter, Input, Output } from '@angular/core';
// import { FormsModule } from '@angular/forms';
//
// @Component({
//   selector: 'app-default-login-layout',
//   standalone: true,
//   imports: [FormsModule],
//   templateUrl: './default-login-layout.component.html',
//   styleUrl: './default-login-layout.component.scss'
// })
// export class DefaultLoginLayoutComponent {
//   @Input() title: string = "";
//   @Input() primaryBtnText: string = "";
//   @Input() secundaryBtnText: string = "";
//   @Input() disablePrimaryBtn: boolean = false;
//
//   @Output("submit") onSubmit = new EventEmitter();
//   @Output("navigate") onNavigate = new EventEmitter();
//
//   submit() {
//     this.onSubmit.emit();
//   }
//
//   navigate() {
//     this.onNavigate.emit();
//   }
// }
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-default-login-layout',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './default-login-layout.component.html',
  styleUrl: './default-login-layout.component.scss'
})
export class DefaultLoginLayoutComponent {
  @Input() title: string = "";
  @Input() primaryBtnText: string = "";
  @Input() secundaryBtnText: string = "";
  @Input() disablePrimaryBtn: boolean = false;

  @Output("submit") onSubmit = new EventEmitter<void>();
  @Output("navigate") onNavigate = new EventEmitter<void>();

  submit() {
    this.onSubmit.emit();
  }

  navigate() {
    this.onNavigate.emit();
  }
}
