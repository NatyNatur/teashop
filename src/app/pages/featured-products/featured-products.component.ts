import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Product, ProductInCart } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-featured-products',
  templateUrl: './featured-products.component.html',
  styleUrls: ['./featured-products.component.css']
})
export class FeaturedProductsComponent implements OnInit {

  featuredProductsList: Product[] = [];

  constructor(private _products: ProductsService, 
    private _cart: CartService, 
    private _toastr: ToastrService,
    private _router: Router) {

  }

  ngOnInit(): void {
    this.getFeaturedProducts();
  }

  getFeaturedProducts() {
    this._products.getFeaturedProducts().then((res: any) => {
      this.featuredProductsList = res;
    });
  }

  addToCart(product: Product) {
    const existingProductInCart: ProductInCart | undefined = this._cart.getProductFromCart(product.id || '');
  
    if (existingProductInCart) {
      // Si el producto ya existe en el carrito, aumenta la cantidad
      existingProductInCart.quantity += 1;
      this._cart.saveCart();
    } else {
      const productInCart: ProductInCart = this._cart.convertProductToProductInCart(product);
      productInCart.quantity = 1;
      this._cart.addToCart(productInCart);
    }
    this._toastr.success('Producto agregado a tu carrito').onTap
    .pipe(take(1))
    .subscribe(() => this.toasterClickedHandler());;
  }

  toasterClickedHandler() {
    console.log('Toastr clicked');
    this._router.navigate(['/carrito']);
  }
}
