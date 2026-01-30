import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.scss'
})
export class IniciarSesionComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loading: LoadingService,
    private notification: NotificationService
  ) { }

  redirectToRegister(): void {
    this.router.navigate(['/registrate']);
  }

  loginWithEmail() {
    if (!this.email || !this.password) {
      this.notification.warning('Por favor, completa todos los campos.');
      return;
    }

    this.loading.show();
    this.authService
      .loginWithEmail(this.email, this.password)
      .then(({ error }) => {
        if (error) {
          this.notification.error(error.message);
          this.loading.hide();
          return;
        }

        this.notification.success('¡Bienvenido!');
        this.loading.hide();
        this.router.navigate(['/inicio']);
      })
      .catch((err) => {
        this.notification.error('Error inesperado.');
        this.loading.hide();
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  olvidoContrasena() {
    this.router.navigate(['/olvidoContrasena']);
  }
}