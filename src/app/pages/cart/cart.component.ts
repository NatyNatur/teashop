import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Product, ProductInCart } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
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
  @ViewChild('modalConfirm') modalConfirm?: ModalDirective;
  @ViewChild('isNotAuthenticated') isNotAuthenticated?: ModalDirective;
  @ViewChild('doesntHaveAnAccount') doesntHaveAnAccount?: ModalDirective;


  constructor( private _cart: CartService, 
    private _auth: AuthService) {
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

  emptyCart() {
    this._cart.emptyCart();
    this.productList = this._cart.getCart();
  }

  confirm(): void {
    let token = localStorage.getItem('token') || '';
    let isAuthenticated = this._auth.isAuthenticated();
    if (token === '') {
      this.modalConfirm?.hide();
      this.doesntHaveAnAccount?.show();
    }
    else {
      if (isAuthenticated) {
        console.log('crear y rutear');
      }
      else {
        this.modalConfirm?.hide();
        this.isNotAuthenticated?.show();
      }
    }
  }
}
