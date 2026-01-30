import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Product } from './product.service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

export interface CartItem {
    id?: string;
    product_id: string;
    cart_id?: string;
    quantity: number;
    product?: Product;
}

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private _cartItems = new BehaviorSubject<CartItem[]>([]);

    constructor(
        private supabaseService: SupabaseService,
        private authService: AuthService,
        private notification: NotificationService
    ) {
        this.authService.currentUser.subscribe(user => {
            if (user) {
                this.fetchCart(user.id);
            } else {
                this._cartItems.next([]);
            }
        });
    }

    get cartItems$(): Observable<CartItem[]> {
        return this._cartItems.asObservable();
    }

    get totalItemsCount$(): Observable<number> {
        return this.cartItems$.pipe(
            map(items => items.reduce((acc, item) => acc + item.quantity, 0))
        );
    }

    get cartTotal$(): Observable<number> {
        return this.cartItems$.pipe(
            map(items => items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0))
        );
    }

    async fetchCart(userId: string) {
        try {
            let { data: cart } = await this.supabaseService.client
                .from('carts')
                .select('id')
                .eq('user_id', userId)
                .maybeSingle();

            if (!cart) {
                const { data: newCart, error: createError } = await this.supabaseService.client
                    .from('carts')
                    .insert({ user_id: userId })
                    .select()
                    .maybeSingle();

                if (createError) throw createError;
                cart = newCart;
            }

            if (cart) {
                const { data: items, error: itemsError } = await this.supabaseService.client
                    .from('cart_items')
                    .select('*, product:products(*)')
                    .eq('cart_id', cart.id);

                if (itemsError) throw itemsError;
                this._cartItems.next(items as unknown as CartItem[]);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            this._cartItems.next([]);
        }
    }

    async addToCart(product: Product, quantity = 1) {
        const { data: { user } } = await this.supabaseService.client.auth.getUser();

        if (!user) {
            this.notification.warning('Inicia sesión para añadir productos al carrito');
            return;
        }

        const userId = user.id;

        // 1. Get/Create Cart
        let { data: cart } = await this.supabaseService.client
            .from('carts')
            .select('id')
            .eq('user_id', userId)
            .maybeSingle();

        if (!cart) {
            const { data: newCart } = await this.supabaseService.client
                .from('carts')
                .insert({ user_id: userId })
                .select()
                .maybeSingle();
            cart = newCart;
        }

        if (!cart) {
            this.notification.error('Error al inicializar el carrito');
            return;
        }

        // 2. Check Item
        const { data: existingItem } = await this.supabaseService.client
            .from('cart_items')
            .select('*')
            .eq('cart_id', cart.id)
            .eq('product_id', product.id)
            .maybeSingle();

        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity <= 0) {
                await this.removeFromCart(existingItem.id!);
            } else {
                const { error } = await this.supabaseService.client
                    .from('cart_items')
                    .update({ quantity: newQuantity })
                    .eq('id', existingItem.id);

                if (!error) {
                    this.notification.success(`Actualizado: ${product.name}`);
                    await this.fetchCart(userId);
                }
            }
        } else {
            if (quantity > 0) {
                const { error } = await this.supabaseService.client
                    .from('cart_items')
                    .insert({
                        cart_id: cart.id,
                        product_id: product.id,
                        quantity: quantity
                    });

                if (!error) {
                    this.notification.success(`Añadido: ${product.name}`);
                    await this.fetchCart(userId);
                }
            }
        }
    }

    async removeFromCart(itemId: string) {
        const { error } = await this.supabaseService.client
            .from('cart_items')
            .delete()
            .eq('id', itemId);

        if (!error) {
            this.notification.info('Producto eliminado');
            const { data: { user } } = await this.supabaseService.client.auth.getUser();
            if (user) await this.fetchCart(user.id);
        }
    }

    async updateQuantity(itemId: string, newQuantity: number) {
        if (newQuantity <= 0) {
            return this.removeFromCart(itemId);
        }

        const { error } = await this.supabaseService.client
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('id', itemId);

        if (!error) {
            const { data: { user } } = await this.supabaseService.client.auth.getUser();
            if (user) await this.fetchCart(user.id);
        }
    }

    async clearCart() {
        const { data: { user } } = await this.supabaseService.client.auth.getUser();
        if (!user) return;

        let { data: cart } = await this.supabaseService.client
            .from('carts')
            .select('id')
            .eq('user_id', user.id)
            .maybeSingle();

        if (cart) {
            await this.supabaseService.client
                .from('cart_items')
                .delete()
                .eq('cart_id', cart.id);

            this.fetchCart(user.id);
        }
    }
}
