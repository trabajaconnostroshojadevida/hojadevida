import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  products: Product[] = [];
  loading = true;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private notification: NotificationService
  ) { }

  async ngOnInit() {
    this.loading = true;
    const { data, error } = await this.productService.getProducts(8);
    if (data) {
      this.products = data;
    }
    this.loading = false;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    // Notification is now handled by CartService for consistency
  }
}