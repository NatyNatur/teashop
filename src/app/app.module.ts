import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ToastrModule } from 'ngx-toastr';

import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';

import { environment } from 'src/environments/environment';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth } from '@angular/fire/auth';
import { getAuth } from 'firebase/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { CategoriesComponent } from './pages/admin/categories/categories.component';
import { GeneralComponent } from './pages/admin/general/general.component';
import { OrdersComponent } from './pages/admin/orders/orders.component';
import { FeaturedProductsComponent } from './pages/featured-products/featured-products.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { MiniLoaderComponent } from './components/mini-loader/mini-loader.component';
import { ThousandsPipe } from './pipes/thousands.pipe';
import { CartComponent } from './pages/cart/cart.component';
import { UnderConstructionComponent } from './pages/under-construction/under-construction.component';
import { CategoryComponent } from './pages/category/category.component';
import { UserInformationComponent } from './pages/welcome/user-information/user-information.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { UserOrdersComponent } from './pages/welcome/user-orders/user-orders.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoaderComponent,
    LoginComponent,
    SignupComponent,
    WelcomeComponent,
    NotFoundComponent,
    HomeComponent,
    AdminComponent,
    ProductsComponent,
    CategoriesComponent,
    GeneralComponent,
    OrdersComponent,
    FeaturedProductsComponent,
    ProductDetailComponent,
    MiniLoaderComponent,
    ThousandsPipe,
    CartComponent,
    UnderConstructionComponent,
    CategoryComponent,
    UserInformationComponent,
    CheckoutComponent,
    UserOrdersComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ToastrModule.forRoot(),
    CarouselModule.forRoot(),
    TooltipModule.forRoot(),
    PopoverModule.forRoot(),
    ReactiveFormsModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
