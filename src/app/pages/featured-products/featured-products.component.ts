import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
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

  constructor(private _products: ProductsService, private _cart: CartService, private _toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.getFeaturedProducts();

  }

  getFeaturedProducts() {
    this._products.getFeaturedProducts().then((res: any) => {
      console.log(res);
      this.featuredProductsList = res;
    });
  }

  addToCart2(product: Product) {
    console.log(product);
    if (!this._cart.checkProductInCart(product)) {
      const productInCart: ProductInCart = this._cart.convertProductToProductInCart(product);
      productInCart.quantity = 1;
      this._cart.addToCart(productInCart);
      console.log(this._cart.getCart());
      this._toastr.success('Producto agregado a tu carrito')
    }
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
    this._toastr.success('Producto agregado a tu carrito');
  }
}
