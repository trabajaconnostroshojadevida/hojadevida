import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { PostgrestError } from '@supabase/supabase-js';

export interface Product {
    id: string;
    category_id?: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    image_url: string;
    is_active: boolean;
    created_at?: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    constructor(private supabaseService: SupabaseService) { }

    async getProducts(limit = 20): Promise<{ data: Product[] | null; error: PostgrestError | null }> {
        return this.supabaseService.client
            .from('products')
            .select('*')
            .eq('is_active', true)
            .limit(limit);
    }

    async getCategories(): Promise<{ data: Category[] | null; error: PostgrestError | null }> {
        return this.supabaseService.client
            .from('categories')
            .select('*');
    }

    async getProductBySlug(slug: string): Promise<{ data: Product | null; error: PostgrestError | null }> {
        return this.supabaseService.client
            .from('products')
            .select('*')
            .eq('slug', slug)
            .single();
    }

    async getProductsByCategory(categoryId: string): Promise<{ data: Product[] | null; error: PostgrestError | null }> {
        return this.supabaseService.client
            .from('products')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true);
    }

    // Admin methods (optional for now, but good to have)
    async createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<{ data: Product[] | null; error: PostgrestError | null }> {
        return this.supabaseService.client
            .from('products')
            .insert(product)
            .select();
    }

    async updateProduct(id: string, updates: Partial<Product>): Promise<{ data: Product[] | null; error: PostgrestError | null }> {
        return this.supabaseService.client
            .from('products')
            .update(updates)
            .eq('id', id)
            .select();
    }

    async deleteProduct(id: string): Promise<{ error: PostgrestError | null }> {
        return this.supabaseService.client
            .from('products')
            .delete()
            .eq('id', id);
    }
}
