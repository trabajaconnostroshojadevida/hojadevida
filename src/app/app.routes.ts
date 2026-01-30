import { Routes } from '@angular/router';
import { IniciarSesionComponent } from './iniciar-sesion/iniciar-sesion.component';
import { CrearCuentaComponent } from './crear-cuenta/crear-cuenta.component';
import { HomeComponent } from './home/home.component';
import { OlvideContrasenaComponent } from './olvide-contrasena/olvide-contrasena.component';
import { LayoutComponent } from './shared/components/layout/layout.component'; // Ensure path is correct
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { ProductDetailComponent } from './features/products/product-detail/product-detail.component';
import { CartComponent } from './features/cart/cart.component';
import { ProductManagementComponent } from './features/admin/product-management/product-management.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'inicio', pathMatch: 'full' },
            { path: 'inicio', component: HomeComponent },
            { path: 'productos', component: ProductListComponent },
            { path: 'productos/:slug', component: ProductDetailComponent },
            { path: 'carrito', component: CartComponent },
            { path: 'admin', component: ProductManagementComponent },
        ]
    },
    {
        path: 'iniciarSesion',
        component: IniciarSesionComponent
    },
    {
        path: 'registrate',
        component: CrearCuentaComponent
    },
    {
        path: 'olvidoContrasena',
        component: OlvideContrasenaComponent
    },
    { path: '**', redirectTo: 'inicio' }
];
