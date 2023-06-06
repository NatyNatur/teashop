import { Injectable } from '@angular/core';
import { Product, ProductInCart } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart: any[] = [];

  constructor() { }

  getCart() {
    return this.cart;
  }

  saveCart() {
    localStorage.setItem('carrito', JSON.stringify(this.cart));
  }

  addToCart(productToAdd:ProductInCart) {
    this.cart.push(productToAdd);
    this.saveCart();
  }

  loadCart() {
    this.cart = JSON.parse(localStorage.getItem('carrito') as any) || [];
  }

  checkProductInCart(product: Product) {
    return this.cart.findIndex((x:any) => x.id === product.id) > -1;
  }

  getProductFromCart(productId: string): ProductInCart | undefined {
    return this.cart.find(product => product.id === productId);
  }

  removeProduct(product: Product) {
    const index = this.cart.findIndex((x:any) => x.id === product.id)
    
    if (index > -1) {
      this.cart.splice(index, 1);
      this.saveCart();
    }
  }

  clearCart() {
    localStorage.removeItem('carrito');
  }

  convertProductToProductInCart(product: Product): ProductInCart {
    const productInCart: ProductInCart = {
      id: product.id,
      product_name: product.product_name,
      product_description: product.product_description,
      product_price: product.product_price,
      product_stock: product.product_stock,
      product_image: product.product_image,
      product_imageUrl: product.product_imageUrl,
      product_featured: product.product_featured,
      product_category: product.product_category,
      product_subcategory: product.product_subcategory,
      product_imageName: product.product_imageName,
      quantity: 0,
    };
  
    return productInCart;
  }
}
