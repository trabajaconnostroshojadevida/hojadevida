import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../../services/product.service';
import { CartService } from '../../../services/cart.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Header & Filters -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div class="max-w-xl">
          <h2 class="text-4xl font-black text-primary tracking-tight uppercase mb-3">Nuestra Colección</h2>
          <p class="text-gray-500 font-medium leading-relaxed">Presentamos una selección curada de piezas exclusivas diseñadas para elevar tu estilo personal. Calidad artesanal en cada detalle.</p>
        </div>
        
        <!-- Search Bar -->
        <div class="w-full md:w-80 group">
           <div class="relative">
             <input type="text" [(ngModel)]="searchQuery" (input)="filterProducts()"
                    placeholder="Buscar productos..." 
                    class="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-medium text-sm">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
             </svg>
           </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div *ngFor="let i of [1,2,3,4,5,6,7,8]" class="animate-pulse">
           <div class="aspect-square bg-gray-100 rounded-[2rem] mb-4"></div>
           <div class="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
           <div class="h-4 bg-gray-100 rounded w-1/2"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && filteredProducts.length === 0" class="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-gray-50">
          <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <h3 class="text-xl font-bold text-primary uppercase tracking-widest">No se encontraron productos</h3>
          <p class="text-gray-400 mt-2">Prueba ajustando tu búsqueda o filtros.</p>
          <button (click)="searchQuery = ''; filterProducts()" class="mt-8 text-accent font-bold uppercase tracking-widest hover:underline">Ver todo el catálogo</button>
      </div>

      <!-- Product Grid -->
      <div *ngIf="!loading && filteredProducts.length > 0" 
           class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12 pb-12">
        <div *ngFor="let product of filteredProducts" 
             class="group relative transition-all duration-500">
          
          <!-- Card Image Container -->
          <div class="relative aspect-square overflow-hidden rounded-[2.5rem] bg-gray-50 mb-6 shadow-sm group-hover:shadow-2xl group-hover:shadow-primary/10 transition-all duration-500">
            <img [src]="product.image_url || 'assets/placeholder.png'" [alt]="product.name" 
                 class="w-full h-full object-center object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer"
                 [routerLink]="['/productos', product.slug]">
            
            <!-- Quick Add Overlay (Desktop) -->
            <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
               <button (click)="addToCart($event, product)" 
                       class="bg-white text-primary px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl hover:bg-accent hover:text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
                  </svg>
                  Añadir
               </button>
            </div>
          </div>
          
          <!-- Product Content -->
          <div class="px-2">
            <div class="flex justify-between items-start mb-2">
               <div>
                 <h3 class="font-bold text-primary text-sm uppercase tracking-wide cursor-pointer hover:text-accent transition-colors leading-tight"
                     [routerLink]="['/productos', product.slug]">
                   {{ product.name }}
                 </h3>
                 <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Colección Vercha</p>
               </div>
               <p class="text-primary font-black text-sm">{{ product.price | currency:'USD' }}</p>
            </div>
            <p class="text-gray-400 text-[11px] leading-relaxed line-clamp-2 h-8 font-medium italic">
              {{ product.description }}
            </p>
            
            <!-- Mobile Add Button -->
            <button (click)="addToCart($event, product)" 
                    class="lg:hidden w-full mt-4 py-3 border border-gray-100 rounded-xl font-bold text-[10px] uppercase tracking-widest text-primary hover:bg-gray-50 transition-colors active:scale-95">
               Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchQuery: string = '';
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationService
  ) { }

  async ngOnInit() {
    this.loadProducts();
  }

  async loadProducts() {
    this.loading = true;
    const { data, error } = await this.productService.getProducts(100);
    if (data) {
      this.products = data;
      this.filteredProducts = data;
    } else {
      console.error("Error loading products", error);
    }
    this.loading = false;
  }

  filterProducts() {
    if (!this.searchQuery) {
      this.filteredProducts = this.products;
    } else {
      const q = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
  }

  addToCart(event: Event, product: Product) {
    event.stopPropagation();
    event.preventDefault();
    this.cartService.addToCart(product);
  }
}
