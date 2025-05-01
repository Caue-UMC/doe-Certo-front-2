import { Component, Input, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import {NgIf} from "@angular/common";

type InputTypes = 'text' | 'email' | 'password';

@Component({
  selector: 'app-primary-input',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  templateUrl: './primary-input.component.html',
  styleUrls: ['./primary-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ]
})
export class PrimaryInputComponent implements ControlValueAccessor {
  @Input() type: InputTypes = 'text';
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() inputName: string = '';
  @Input() disabled: boolean = false;

  value: string = ''; // Controla o valor do input
  formControl: FormControl = new FormControl(); // Controla o formControl interno, caso necessário

  onChange: any = () => {};
  onTouched: any = () => {};

  // Função chamada quando o valor do componente é alterado
  writeValue(value: string): void {
    if (value !== undefined) {
      this.value = value;
    }
  }

  // Função para registrar o evento de mudança de valor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Função para registrar o evento de toque no campo
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Função para habilitar/desabilitar o campo
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Função chamada para capturar o valor digitado no input
  handleInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.onTouched();
  }
}
