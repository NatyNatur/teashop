import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AdminComponent } from './pages/admin/admin.component';
import { GeneralComponent } from './pages/admin/general/general.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { OrdersComponent } from './pages/admin/orders/orders.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { UnderConstructionComponent } from './pages/under-construction/under-construction.component';
import { CategoryComponent } from './pages/category/category.component';
import { UserInformationComponent } from './pages/welcome/user-information/user-information.component';
import { AuthGuard } from './guards/auth.guard';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { UserOrdersComponent } from './pages/welcome/user-orders/user-orders.component';
import { DiscountCodesComponent } from './pages/admin/discount-codes/discount-codes.component';

const routes: Routes = [
  {
    path: '',
    title: 'Inicio | naturtea',
    component: HomeComponent
  },
  {
    path: 'cliente',
    title: 'Bienvenido | naturtea',
    component: WelcomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'mi-cuenta',
        pathMatch: 'full'
      },
      {
        path: 'mi-cuenta',
        component: UserInformationComponent
      },
      {
        path: 'mis-pedidos',
        component: UserOrdersComponent
      }
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'registro',
    title: 'Regístrate | naturtea',
    component: SignupComponent
  },
  {
    path: 'ingresa',
    title: 'Ingresa | naturtea',
    component: LoginComponent
  },
  {
    path: 'en-construccion',
    title: 'Ups',
    component: UnderConstructionComponent
  },
  {
    path: 'admin',
    title: 'Administración | naturtea',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'general',
        pathMatch: 'full'
      },
      {
        path: 'general',
        component: GeneralComponent,
      },
      {
        path: 'productos',
        component: ProductsComponent,
      },
      {
        path: 'categorias',
        component: CategoriesComponent,
      },
      {
        path: 'pedidos',
        component: OrdersComponent,
      },
      {
        path: 'codigos',
        component: DiscountCodesComponent,
      }
    ],
    canActivate: [AuthGuard],
    data: {
      role: 'admin'
    },
  },
  {
    path: 'producto/:productId',
    title: 'Producto | naturtea',
    component: ProductDetailComponent
  },
  {
    path: 'categoria',
    title: 'Categoría',
    component: CategoryComponent,
  },
  {
    path: 'carrito',
    title: 'Carrito | naturtea',
    component: CartComponent
  },
  {
    path: 'checkout',
    title: 'Checkout | naturtea',
    component: CheckoutComponent
  },
  {
    path: '404',
    component: NotFoundComponent
  },
  // {
  //   path: '**',
  //   redirectTo: '/no-encontrado'
  // },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
