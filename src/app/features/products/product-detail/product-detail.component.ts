import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <div class="max-w-7xl mx-auto px-4 py-8 md:py-16">
      <!-- Loading State -->
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mb-4"></div>
        <p class="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Cargando Pieza Exclusiva...</p>
      </div>
      
      <!-- Back Link -->
      <div *ngIf="!loading && product" class="mb-8">
        <a routerLink="/productos" class="inline-flex items-center text-gray-400 hover:text-accent font-bold text-xs uppercase tracking-widest transition-colors group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la Colección
        </a>
      </div>

      <!-- Detail Card -->
      <div *ngIf="product" class="bg-white rounded-[3rem] shadow-premium border border-gray-50 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
        
        <!-- Left Side: Image Showcase -->
        <div class="lg:w-1/2 p-8 md:p-12 bg-gray-50/50 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-accent/5 opacity-30 blur-3xl rounded-full scale-150"></div>
          <img [src]="product.image_url || 'assets/placeholder.png'" 
               class="relative z-10 max-h-[500px] w-full object-contain animate-in fade-in zoom-in duration-700" [alt]="product.name">
        </div>
        
        <!-- Right Side: Interaction & Details -->
        <div class="p-8 md:p-16 lg:w-1/2 flex flex-col justify-center">
          <div class="mb-8">
            <p class="text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-4">Colección Limitada</p>
            <h1 class="text-3xl md:text-5xl font-black text-primary leading-tight uppercase tracking-tight mb-4">{{ product.name }}</h1>
            <div class="flex items-center space-x-4">
              <p class="text-3xl font-black text-primary">{{ product.price | currency:'USD' }}</p>
              <span class="px-3 py-1 bg-green-50 text-green-500 text-[10px] font-black uppercase tracking-wider rounded-lg border border-green-100">Disponible</span>
            </div>
          </div>
          
          <div class="prose prose-sm mb-10">
            <p class="text-gray-500 font-medium leading-[1.8] italic underline decoration-accent/20 decoration-2 underline-offset-4">
              "{{ product.description }}"
            </p>
          </div>
          
          <!-- Actions -->
          <div class="space-y-6">
            <div class="flex items-center gap-6">
               <div class="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100 h-14">
                 <button (click)="decrementQuantity()" 
                         class="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-white rounded-xl transition-all disabled:opacity-30"
                         [disabled]="quantity <= 1">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4" />
                   </svg>
                 </button>
                 <span class="w-12 text-center font-black text-primary text-lg">{{ quantity }}</span>
                 <button (click)="incrementQuantity()" 
                         class="w-11 h-11 flex items-center justify-center text-gray-400 hover:text-accent hover:bg-white rounded-xl transition-all"
                         [disabled]="product.stock <= quantity">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                   </svg>
                 </button>
               </div>
               
               <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{{ product.stock }} unidades en inventario</p>
            </div>

            <button (click)="addToCart()" [disabled]="product.stock === 0"
                    class="w-full py-5 bg-primary text-white font-black text-xs uppercase tracking-[0.3em] rounded-2xl hover:bg-primary-dark transition-all transform hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/20 flex justify-center items-center group disabled:opacity-40">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Añadir a la Bolsa
            </button>
          </div>
          
          <!-- Small details -->
          <div class="mt-12 flex items-center space-x-8 border-t border-gray-50 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
             <div class="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
               </svg>
               Envío Expreso
             </div>
             <div class="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
               </svg>
               Certificado Vercha
             </div>
          </div>
        </div>

      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !product" class="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-gray-50">
          <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h2 class="text-2xl font-black text-primary uppercase tracking-widest">Pieza no encontrada</h2>
          <p class="text-gray-400 mt-2 mb-10">Lo sentimos, esta pieza ya no forma parte de nuestra colección actual.</p>
          <a routerLink="/productos" class="inline-flex items-center px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-primary-dark transition-all transform active:scale-95 shadow-xl">
             Explorar Catálogo
          </a>
      </div>
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
    product: Product | null = null;
    loading = true;
    quantity = 1;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService,
        private notification: NotificationService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const slug = params.get('slug');
            if (slug) {
                this.loadProduct(slug);
            }
        });
    }

    async loadProduct(slug: string) {
        this.loading = true;
        try {
            const { data, error } = await this.productService.getProductBySlug(slug);
            if (data) {
                this.product = data;
            }
        } catch (err) {
            console.error(err);
        } finally {
            this.loading = false;
        }
    }

    incrementQuantity() {
        if (this.product && this.quantity < this.product.stock) {
            this.quantity++;
        }
    }

    decrementQuantity() {
        if (this.quantity > 1) {
            this.quantity--;
        }
    }

    async addToCart() {
        if (this.product) {
            await this.cartService.addToCart(this.product, this.quantity);
            // Notification handled by service
        }
    }
}
