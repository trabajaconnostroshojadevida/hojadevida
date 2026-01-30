import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingService } from '../services/loading.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})


export class LoadingComponent {
  isLoading$!: Observable<boolean>; // Declaramos la propiedad sin inicializar

  constructor(private spinnerService: LoadingService) {}

  ngOnInit() {
    // Inicializamos aquí la propiedad después de que se haya inyectado spinnerService
    this.isLoading$ = this.spinnerService.isLoading$;
  }
}