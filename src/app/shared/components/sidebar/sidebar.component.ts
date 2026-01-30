import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';
import { NotificationService } from '../../../services/notification.service';
import { User } from '@supabase/supabase-js';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Overlay for mobile -->
    <div *ngIf="isOpen" (click)="close.emit()" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"></div>

    <div class="h-screen w-64 bg-primary text-white flex flex-col fixed left-0 top-0 overflow-y-auto z-50 transition-transform transform duration-300 ease-in-out border-r border-primary-light/10 shadow-2xl"
         [ngClass]="{'translate-x-0': isOpen, '-translate-x-full': !isOpen, 'md:translate-x-0': true}">
      
      <!-- Logo Container -->
      <div class="p-8 flex justify-between items-center group">
        <a routerLink="/inicio" class="block transition-transform duration-300 hover:scale-105" (click)="close.emit()">
          <img src="assets/iconos/lo2.png" alt="VERCHA" class="h-10 w-auto brightness-110 contrast-125 object-contain rounded-sm shadow-sm">
        </a>
        <button (click)="close.emit()" class="md:hidden p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Main Navigation -->
      <nav class="flex-1 px-4 py-2 space-y-1">
        <p class="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 opacity-70">Navegación</p>
        
        <a routerLink="/inicio" routerLinkActive="bg-white/10 text-white border-l-4 border-accent" (click)="close.emit()"
           class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group border-l-4 border-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="font-medium">Inicio</span>
        </a>

        <a routerLink="/productos" routerLinkActive="bg-white/10 text-white border-l-4 border-accent" (click)="close.emit()"
           class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group border-l-4 border-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span class="font-medium">Tienda</span>
        </a>
        
        <a routerLink="/carrito" routerLinkActive="bg-white/10 text-white border-l-4 border-accent" (click)="close.emit()"
           class="flex items-center justify-between px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group border-l-4 border-transparent">
           <div class="flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
             </svg>
             <span class="font-medium">Mi Carrito</span>
           </div>
           <span *ngIf="(cartCount$ | async) || 0 > 0" 
                 class="bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
             {{ cartCount$ | async }}
           </span>
        </a>

        <!-- Auth Conditional Sections -->
        <ng-container *ngIf="user">
          <div class="pt-8 mt-4">
            <p class="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 opacity-70">Mi Cuenta</p>
            
            <a routerLink="/perfil" routerLinkActive="bg-white/10 text-white border-l-4 border-accent" (click)="close.emit()"
               class="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all group border-l-4 border-transparent">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="font-medium">Perfil</span>
            </a>

            <!-- Admin Link -->
            <a *ngIf="isAdmin$ | async" routerLink="/admin" routerLinkActive="bg-white/10 text-white border-l-4 border-amber-400" (click)="close.emit()"
               class="flex items-center px-4 py-3 rounded-xl text-amber-200/70 hover:bg-white/5 hover:text-amber-400 transition-all group border-l-4 border-transparent">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 group-hover:text-amber-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
               </svg>
               <span class="font-bold">Panel Admin</span>
            </a>
          </div>
        </ng-container>

        <!-- Unauthenticated links -->
        <ng-container *ngIf="!user">
           <div class="pt-8 mt-4 px-2">
             <a routerLink="/iniciarSesion" (click)="close.emit()"
                class="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-accent text-white hover:bg-accent-dark transition-all shadow-lg font-bold group">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
               </svg>
               Acceder
             </a>
           </div>
        </ng-container>
      </nav>

      <!-- Bottom Profile Section -->
      <div *ngIf="user" class="p-4 border-t border-white/5 bg-primary-dark/30">
          <div class="flex items-center p-2 mb-4">
              <div class="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold shadow-inner">
                  {{ user.email?.charAt(0)?.toUpperCase() }}
              </div>
              <div class="ml-3 overflow-hidden">
                  <p class="text-xs font-bold truncate">{{ user.email }}</p>
                  <p class="text-[10px] text-gray-400 capitalize">{{ (isAdmin$ | async) ? 'Administrador' : 'Cliente' }}</p>
              </div>
          </div>
          <button (click)="logout()" class="flex items-center w-full px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 group-hover:text-red-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span class="font-medium group-hover:text-red-400 transition-colors">Cerrar Sesión</span>
          </button>
      </div>

    </div>
  `
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  user: User | null = null;
  isAdmin$: Observable<boolean>;
  cartCount$: Observable<number>;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.isAdmin$ = this.authService.isAdmin;
    this.cartCount$ = this.cartService.totalItemsCount$;
  }

  ngOnInit() {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  async logout() {
    const { error } = await this.authService.logout();
    if (!error) {
      this.notification.success('Sesión cerrada correctamente');
      this.router.navigate(['/inicio']);
      this.close.emit();
    } else {
      this.notification.error('Error al cerrar sesión');
    }
  }
}
