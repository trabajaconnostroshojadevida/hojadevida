import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-100 h-16 flex items-center justify-between px-4 md:hidden sticky top-0 z-40">
      <!-- Toggle Sidebar Button -->
      <div class="flex items-center">
        <button (click)="toggleSidebar.emit()" class="text-gray-500 hover:text-primary focus:outline-none p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      <!-- Center Logo -->
      <div class="absolute left-1/2 transform -translate-x-1/2">
        <a routerLink="/inicio" class="flex items-center">
          <img src="assets/iconos/lo2.png" alt="VERCHA" class="h-9 w-auto object-contain">
        </a>
      </div>

      <!-- Actions: Cart & Profile -->
      <div class="flex items-center space-x-1">
        <!-- Cart with Badge -->
        <a routerLink="/carrito" class="relative p-2 text-gray-500 hover:text-accent transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span *ngIf="(cartCount$ | async) || 0 > 0" 
                class="absolute top-1 right-1 bg-accent text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm animate-bounce">
            {{ cartCount$ | async }}
          </span>
        </a>

        <!-- User Profile/Auth -->
        <a *ngIf="!user" routerLink="/iniciarSesion" class="text-gray-500 hover:text-accent transition-colors p-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </a>
        <a *ngIf="user" routerLink="/perfil" class="p-2 transition-transform active:scale-95">
           <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-white font-bold text-xs">
              <span *ngIf="!user.user_metadata?.['avatar_url']">{{ user.email?.charAt(0)?.toUpperCase() }}</span>
              <img *ngIf="user.user_metadata?.['avatar_url']" [src]="user.user_metadata?.['avatar_url']" class="w-full h-full object-cover">
           </div>
        </a>
      </div>
    </header>
  `
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  user: User | null = null;
  cartCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {
    this.cartCount$ = this.cartService.totalItemsCount$;
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(u => {
      this.user = u;
    });
  }
}
