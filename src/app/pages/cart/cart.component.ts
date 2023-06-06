import { Component, OnInit } from '@angular/core';
import { Product, ProductInCart } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  productList: ProductInCart[] = [];
  productQuantity : number = 0;
  subtotal: number = 0;
  exceedsStock: boolean = false;

  constructor( private _cart: CartService) {
  }

  ngOnInit(): void {
      this.getCartList();
  }

  getCartList() {
    this._cart.loadCart();
    this.productList = this._cart.getCart();
    this.addSubtotal();
  }

  onChangeQuantity(updatedValue: number, product: ProductInCart) {
    console.log(updatedValue)
    if (updatedValue != null && updatedValue <= product.product_stock) {
      this.exceedsStock = false;
    }
    this.addSubtotal();
  }

  addSubtotal() {
    this.subtotal = 0;
    for (const product of this.productList) {
      const productTotal = product.product_price * product.quantity;
      this.subtotal += productTotal;
    }
    this._cart.saveCartFromComponent(this.productList);
  }

  checkQuantity(product: ProductInCart) {
    if (product.quantity === null) {
      product.quantity = 0;
    }
  }

  deleteFromCart(product: ProductInCart) {
    this._cart.removeProduct(product);
    this.addSubtotal();
  }
}
