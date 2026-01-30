import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService, CartItem } from '../../services/cart.service';
import { Observable } from 'rxjs';

@Component({
   selector: 'app-cart',
   standalone: true,
   imports: [CommonModule, RouterModule],
   template: `
    <div class="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <header class="mb-10">
        <h1 class="text-3xl md:text-4xl font-black text-primary tracking-tight uppercase">Tu Bolsa de Compras</h1>
        <p class="text-gray-500 mt-2 font-medium">Revisa tus artículos antes de finalizar el pedido.</p>
      </header>

      <div *ngIf="(cartItems$ | async) as cartItems" class="flex flex-col lg:flex-row gap-8">
        
        <!-- Empty State -->
        <div *ngIf="cartItems.length === 0" class="w-full text-center py-24 bg-white rounded-3xl shadow-xl border border-gray-100 px-6">
           <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
           </div>
           <h2 class="text-2xl font-bold text-primary mb-2">Tu bolsa está vacía</h2>
           <p class="text-gray-500 mb-8 max-w-sm mx-auto">Parece que aún no has añadido nada. ¡Explora nuestras colecciones y encuentra tu estilo!</p>
           <a routerLink="/productos" class="inline-flex items-center px-8 py-4 bg-accent text-white font-bold rounded-2xl hover:bg-accent-dark transition-all transform active:scale-95 shadow-lg shadow-accent/20">
              Explorar Catálogo
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
           </a>
        </div>

        <!-- Items Grid -->
        <div *ngIf="cartItems.length > 0" class="lg:w-2/3 space-y-4">
           <div *ngFor="let item of cartItems" class="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start transition-all hover:shadow-md">
              <!-- Product Image -->
              <div class="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-gray-50 rounded-2xl overflow-hidden mb-4 sm:mb-0">
                  <img [src]="item.product?.image_url || 'assets/placeholder.png'" 
                       [alt]="item.product?.name" 
                       class="w-full h-full object-cover">
              </div>

              <!-- Item Details -->
              <div class="flex-1 sm:ml-6 text-center sm:text-left">
                  <div class="flex flex-col sm:flex-row justify-between mb-2">
                      <h3 class="font-bold text-lg text-primary uppercase tracking-wide leading-tight">{{ item.product?.name }}</h3>
                      <p class="text-primary font-black text-xl mt-1 sm:mt-0">{{ item.product?.price | currency:'USD' }}</p>
                  </div>
                  <p class="text-xs text-gray-400 font-medium mb-4 uppercase tracking-widest line-clamp-2 md:line-clamp-none">
                    {{ item.product?.description }}
                  </p>

                  <div class="flex items-center justify-center sm:justify-between pt-4 mt-auto border-t border-gray-50">
                      <!-- Quantity Controls -->
                      <div class="flex items-center bg-gray-50 px-2 py-1 rounded-2xl border border-gray-100">
                          <button (click)="updateQuantity(item, -1)" 
                                  class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-accent disabled:opacity-30"
                                  [disabled]="item.quantity <= 1">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                              </svg>
                          </button>
                          <span class="w-10 text-center font-bold text-primary">{{ item.quantity }}</span>
                          <button (click)="updateQuantity(item, 1)" 
                                  class="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-accent">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                              </svg>
                          </button>
                      </div>

                      <button (click)="removeItem(item.id!)" 
                              class="hidden sm:flex items-center text-red-400 hover:text-red-700 font-bold text-xs uppercase tracking-widest group">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                      </button>
                  </div>
              </div>
           </div>
        </div>

        <!-- Order Summary -->
        <div *ngIf="cartItems.length > 0" class="lg:w-1/3">
           <div class="bg-primary text-white p-8 rounded-[40px] shadow-2xl sticky top-24">
              <h2 class="text-xl font-black uppercase tracking-widest mb-8 border-b border-white/10 pb-4">Resumen de Compra</h2>
              
              <div class="space-y-4 mb-8">
                  <div class="flex justify-between items-center text-gray-400">
                      <span class="text-sm font-medium">Subtotal</span>
                      <span class="font-bold text-white">{{ calculateTotal(cartItems) | currency:'USD' }}</span>
                  </div>
                  <div class="flex justify-between items-center text-gray-400">
                      <span class="text-sm font-medium">Envío</span>
                      <span class="text-xs font-bold text-accent uppercase tracking-widest italic">¡Gratis!</span>
                  </div>
                  <div class="flex justify-between items-center text-gray-400 border-t border-white/5 pt-4">
                      <span class="text-lg font-bold text-white">Total</span>
                      <span class="text-2xl font-black text-white">{{ calculateTotal(cartItems) | currency:'USD' }}</span>
                  </div>
              </div>

              <button class="w-full py-5 bg-accent text-white text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-accent-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-accent/20 mb-4">
                 Finalizar Pedido
              </button>
              
              <div class="flex items-center justify-center space-x-4 opacity-50 grayscale hover:grayscale-0 transition-all">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" class="h-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" class="h-3">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-5">
              </div>
           </div>
        </div>

      </div>
    </div>
  `
})
export class CartComponent implements OnInit {
   cartItems$: Observable<CartItem[]>;

   constructor(private cartService: CartService) {
      this.cartItems$ = this.cartService.cartItems$;
   }

   ngOnInit() { }

   calculateTotal(items: CartItem[]): number {
      return items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
   }

   async updateQuantity(item: CartItem, change: number) {
      const newQty = item.quantity + change;
      if (newQty > 0 && item.id) {
         await this.cartService.updateQuantity(item.id, newQty);
      }
   }

   async removeItem(itemId: string) {
      if (itemId) {
         await this.cartService.removeFromCart(itemId);
      }
   }
}
