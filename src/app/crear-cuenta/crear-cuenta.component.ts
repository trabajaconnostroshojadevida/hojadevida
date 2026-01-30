import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent {
  email: string = '';
  password: string = '';
  firstName: string = '';
  lastName: string = '';

  constructor(
    private router: Router,
    private loading: LoadingService,
    private authService: AuthService,
    private notification: NotificationService
  ) { }

  registerWithEmail() {
    if (!this.email || !this.password || !this.firstName || !this.lastName) {
      this.notification.warning('Por favor completa todos los campos.');
      return;
    }

    this.loading.show();
    this.authService
      .registerWithEmail(this.email, this.password, this.firstName, this.lastName)
      .then(({ error }) => {
        if (error) {
          this.notification.error(error.message);
          this.loading.hide();
          return;
        }
        this.notification.success('¡Registro exitoso! Verifica tu correo.');
        this.loading.hide();
        this.router.navigate(['/iniciarSesion']);
      })
      .catch((err) => {
        this.notification.error('Error inesperado.');
        this.loading.hide();
      });
  }
}
