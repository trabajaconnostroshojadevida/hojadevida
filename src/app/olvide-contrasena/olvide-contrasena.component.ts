import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-olvide-contrasena',
  imports: [FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './olvide-contrasena.component.html',
  styleUrl: './olvide-contrasena.component.scss'
})
export class OlvideContrasenaComponent {

   email: string = '';

  constructor(private authService: AuthService) {}

  enviarCorreo() {
    if (!this.email) {
      Swal.fire({
        icon: 'warning',
        title: 'Correo requerido',
        text: 'Por favor, ingrese un correo válido.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    this.authService.resetPassword(this.email)
      .then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Revisa tu bandeja de entrada para restablecer la contraseña.',
          confirmButtonColor: '#28a745'
        });
      })
      .catch(error => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: this.getMensajeError(error.code),
          confirmButtonColor: '#d33'
        });
      });
  }

  // Traducción de errores de Firebase
  private getMensajeError(errorCode: string): string {
    const mensajes: { [key: string]: string } = {
      'auth/invalid-email': 'El formato del correo no es válido.',
      'auth/user-not-found': 'No se encontró ninguna cuenta con este correo.',
      'auth/too-many-requests': 'Se ha bloqueado el acceso temporalmente debido a muchos intentos fallidos. Intenta más tarde.',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet.',
      'auth/internal-error': 'Error interno. Inténtalo más tarde.',
    };

    return mensajes[errorCode] || 'Ocurrió un error inesperado. Inténtalo de nuevo.';
  }
}