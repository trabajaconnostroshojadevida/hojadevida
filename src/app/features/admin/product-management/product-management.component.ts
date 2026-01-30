import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product, Category } from '../../../services/product.service';
import { NotificationService } from '../../../services/notification.service';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-4 md:p-8 max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 class="text-3xl font-black text-primary tracking-tight uppercase">Control de Inventario</h1>
          <p class="text-gray-500 font-medium">Gestiona el catálogo y stock de tu tienda Vercha.</p>
        </div>
        <button (click)="openCreateModal()" class="w-full md:w-auto px-8 py-4 bg-accent text-white font-black uppercase tracking-widest rounded-2xl hover:bg-accent-dark transition-all shadow-xl shadow-accent/20 flex items-center justify-center transform active:scale-95">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Producto
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Productos</p>
           <h3 class="text-3xl font-black text-primary">{{ products.length }}</h3>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bajo Stock (<10)</p>
           <h3 class="text-3xl font-black text-red-500">{{ lowStockCount }}</h3>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Categorías</p>
           <h3 class="text-3xl font-black text-accent">{{ categories.length }}</h3>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Inactivos</p>
           <h3 class="text-3xl font-black text-gray-400">{{ inactiveCount }}</h3>
        </div>
      </div>

      <!-- Data Table -->
      <div class="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-50 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/50 border-b border-gray-100 text-gray-400 uppercase text-[10px] font-black tracking-[0.2em]">
                <th class="px-8 py-5">Info Producto</th>
                <th class="px-8 py-5">Categoría</th>
                <th class="px-8 py-5 text-center">Precio</th>
                <th class="px-8 py-5 text-center">Stock</th>
                <th class="px-8 py-5 text-center">Estado</th>
                <th class="px-8 py-5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr *ngFor="let product of products" class="hover:bg-gray-50/50 transition-all group">
                <td class="px-8 py-4">
                  <div class="flex items-center">
                    <div class="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 mr-4 flex-shrink-0">
                      <img [src]="product.image_url || 'assets/placeholder.png'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                    </div>
                    <div>
                      <div class="font-bold text-primary text-sm uppercase tracking-wide">{{ product.name }}</div>
                      <div class="text-[10px] text-gray-400 font-mono">{{ product.slug }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-8 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {{ getCategoryName(product.category_id) }}
                </td>
                <td class="px-8 py-4 text-center">
                  <span class="text-sm font-black text-primary">{{ product.price | currency:'USD' }}</span>
                </td>
                <td class="px-8 py-4 text-center">
                  <span [class]="product.stock < 10 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'" 
                        class="px-3 py-1 rounded-lg text-xs font-black min-w-[3rem] inline-block">
                    {{ product.stock }}
                  </span>
                </td>
                <td class="px-8 py-4 text-center">
                  <span [class]="product.is_active ? 'text-green-500' : 'text-gray-300'" 
                        class="inline-flex items-center">
                    <span class="w-2 h-2 rounded-full mr-2" [class]="product.is_active ? 'bg-green-500 animate-pulse' : 'bg-gray-300'"></span>
                    <span class="text-[10px] font-black uppercase tracking-widest">{{ product.is_active ? 'En Venta' : 'Oculto' }}</span>
                  </span>
                </td>
                <td class="px-8 py-4 text-right">
                  <div class="flex items-center justify-end space-x-2">
                    <button (click)="openEditModal(product)" class="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button (click)="deleteProduct(product)" class="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-90">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal Overlay -->
      <div *ngIf="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/20 backdrop-blur-xl animate-in fade-in duration-300">
        <!-- Modal Content -->
        <div class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 border border-white/20">
          
          <div class="flex h-full flex-col lg:flex-row">
             <!-- Left Side: Preview -->
             <div class="lg:w-1/3 bg-gray-50 p-10 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-gray-100">
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8 w-full text-center">Vista Previa</p>
                 <div class="w-full aspect-square bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden group">
                    <img [src]="currentProduct.image_url || 'assets/placeholder.png'" 
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                 </div>
                 <div class="mt-8 text-center">
                    <h4 class="font-bold text-primary uppercase text-sm tracking-wide">{{ currentProduct.name || 'Sin nombre' }}</h4>
                    <p class="text-accent font-black text-xl mt-1">{{ (currentProduct.price || 0) | currency:'USD' }}</p>
                 </div>
             </div>

             <!-- Right Side: Form -->
             <div class="lg:w-2/3 flex flex-col h-[80vh] lg:h-auto">
                 <div class="p-8 border-b border-gray-50 flex justify-between items-center">
                    <h2 class="text-xl font-black text-primary uppercase tracking-widest">{{ isEditing ? 'Actualizar Producto' : 'Nuevo Producto' }}</h2>
                    <button (click)="closeModal()" class="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                 </div>

                 <div class="p-8 overflow-y-auto flex-1">
                    <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div class="md:col-span-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Nombre del Producto</label>
                        <input type="text" [(ngModel)]="currentProduct.name" name="name"
                               class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-medium">
                      </div>

                      <div>
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Slug Único</label>
                        <input type="text" [(ngModel)]="currentProduct.slug" name="slug"
                               class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-mono text-xs">
                      </div>

                      <div>
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Categoría</label>
                        <select [(ngModel)]="currentProduct.category_id" name="category_id"
                                class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-medium appearance-none">
                          <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
                        </select>
                      </div>

                      <div>
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Precio ($)</label>
                        <input type="number" [(ngModel)]="currentProduct.price" name="price"
                               class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-bold">
                      </div>

                      <div>
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Unidades en Stock</label>
                        <input type="number" [(ngModel)]="currentProduct.stock" name="stock"
                               class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all font-bold">
                      </div>

                      <div class="md:col-span-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">URL de la Imagen</label>
                        <input type="text" [(ngModel)]="currentProduct.image_url" name="image_url"
                               class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all text-xs">
                      </div>

                      <div class="md:col-span-2">
                        <label class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Descripción Detallada</label>
                        <textarea [(ngModel)]="currentProduct.description" name="description" rows="3"
                                  class="w-full px-5 py-4 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 outline-none transition-all text-sm font-medium"></textarea>
                      </div>

                      <div class="md:col-span-2 flex items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div class="relative inline-block w-12 h-6 mr-3 align-middle select-none transition duration-200 ease-in">
                          <input type="checkbox" [(ngModel)]="currentProduct.is_active" name="is_active" id="modal_active"
                                 class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:bg-accent checked:border-accent right-6 checked:right-0 transition-all duration-300">
                          <label for="modal_active" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                        <label for="modal_active" class="text-xs font-black uppercase tracking-[0.2em] text-primary cursor-pointer">Visibilidad en Tienda</label>
                      </div>
                    </form>
                 </div>

                 <div class="p-8 border-t border-gray-50 flex flex-col md:flex-row justify-end gap-3 bg-gray-50/50">
                    <button (click)="closeModal()" class="order-2 md:order-1 px-8 py-4 font-black text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                      Cancelar
                    </button>
                    <button (click)="saveProduct()" 
                            [disabled]="!currentProduct.name || (currentProduct.price || 0) < 0"
                            class="order-1 md:order-2 px-10 py-4 bg-primary text-white font-black text-[10px] uppercase tracking-[0.3em] rounded-2xl hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 disabled:opacity-50 transform active:scale-95">
                      {{ isEditing ? 'Actualizar Registro' : 'Crear Producto' }}
                    </button>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
    <style>
      .toggle-checkbox:checked { right: 0; border-color: #D4AF37; }
      .toggle-checkbox:checked + .toggle-label { background-color: #D4AF37; }
      @keyframes in { from { opacity: 0; } to { opacity: 1; } }
      .animate-in { animation: in 0.3s ease-out; }
    </style>
  `
})
export class ProductManagementComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  showModal = false;
  isEditing = false;
  currentProduct: Partial<Product> = {
    is_active: true,
    price: 0,
    stock: 0
  };

  constructor(
    private productService: ProductService,
    private notification: NotificationService,
    private loading: LoadingService
  ) { }

  async ngOnInit() {
    this.loadData();
  }

  get lowStockCount() {
    return this.products.filter(p => p.stock < 10 && p.is_active).length;
  }

  get inactiveCount() {
    return this.products.filter(p => !p.is_active).length;
  }

  async loadData() {
    this.loading.show();
    const [pRes, cRes] = await Promise.all([
      this.productService.getProducts(100),
      this.productService.getCategories()
    ]);

    if (pRes.data) this.products = pRes.data;
    if (cRes.data) this.categories = cRes.data;
    this.loading.hide();
  }

  getCategoryName(id?: string) {
    return this.categories.find(c => c.id === id)?.name || 'Sin categoría';
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentProduct = { is_active: true, price: 0, stock: 0 };
    this.showModal = true;
  }

  openEditModal(product: Product) {
    this.isEditing = true;
    this.currentProduct = { ...product };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  async saveProduct() {
    this.loading.show();
    if (this.isEditing && this.currentProduct.id) {
      const { error } = await this.productService.updateProduct(this.currentProduct.id, this.currentProduct);
      if (!error) {
        this.notification.success('Producto actualizado');
        this.closeModal();
        this.loadData();
      } else {
        this.notification.error(error.message);
      }
    } else {
      const { error } = await this.productService.createProduct(this.currentProduct as any);
      if (!error) {
        this.notification.success('Producto creado');
        this.closeModal();
        this.loadData();
      } else {
        this.notification.error(error.message);
      }
    }
    this.loading.hide();
  }

  async deleteProduct(product: Product) {
    if (confirm(`¿Estás seguro de eliminar ${product.name}?`)) {
      this.loading.show();
      const { error } = await this.productService.deleteProduct(product.id);
      if (!error) {
        this.notification.success('Producto eliminado');
        this.loadData();
      } else {
        this.notification.error(error.message);
      }
      this.loading.hide();
    }
  }
}
