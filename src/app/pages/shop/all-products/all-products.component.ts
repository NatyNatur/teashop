import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Product, ProductInCart } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent {
  productsList: Product[] = [];
  isReady: boolean = false;

  constructor(private _loader: LoaderService,
    private _products: ProductsService,
    private _cart: CartService,
    private _toastr: ToastrService,
    private _router: Router) {
    this.getProducts();
  }
  
  getProducts() {
    this._loader.loaderOn();
    this._products.getProductsObs().subscribe(products => {
      this.productsList = products;
      this._loader.loaderOff();
      this.isReady = true;
    })
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
    .subscribe(() => this.toasterClickedHandler());
  }

  toasterClickedHandler() {
    this._router.navigate(['/carrito']);
  }
}
