import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product, ProductInCart } from 'src/app/models/product.model';
import { LoaderService } from 'src/app/services/loader.service';
import { ProductsService } from '../../../services/products.service';
import { Observable, take } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  product: Product | undefined;
  productsList: any;
  isReady: boolean = false;
  productQuantity : number = 1;
  productStock: number = 10;
  cart: any[] = [];

  state$: Observable<object> | undefined;

  constructor(private _route: ActivatedRoute, 
    private _loader: LoaderService, 
    private _products: ProductsService,
    private _cart: CartService, 
    private _toastr: ToastrService,
    private _router: Router) {

  }

  ngOnInit(): void {
    this.getProducts();
    
  }

  getProducts() {
    this._loader.loaderOn();

    this._products.readProducts().then((res: any) => {
      //console.log(res);
      this.productsList = res;
      this._loader.loaderOff();
      this.selectProduct();
    })
  }

  selectProduct() {
    const routeParams = this._route.snapshot.paramMap;
    const productIdFromRoute = routeParams.get('productId');
    //console.log(productIdFromRoute);

    this.product = this.productsList.find((product: any) => product.id === productIdFromRoute);
    this.productStock = this.product!.product_stock;
    this.isReady = true;
  }

  addToCart(product: Product, quantity: number) {
    const existingProductInCart: ProductInCart | undefined = this._cart.getProductFromCart(product.id || '');
  
    if (existingProductInCart) {
      // Si el producto ya existe en el carrito, aumenta la cantidad
      existingProductInCart.quantity = quantity;
      this._cart.saveCart();
    } else {
      const productInCart: ProductInCart = this._cart.convertProductToProductInCart(product);
      productInCart.quantity = quantity;
      this._cart.addToCart(productInCart);
    }
  
    this._toastr.success('Producto agregado a tu carrito').onTap
    .pipe(take(1))
    .subscribe(() => this.toasterClickedHandler());
  }

  toasterClickedHandler() {
    this._router.navigate(['/carrito']);
  }

  decreaseProduct() {
    if (this.productQuantity > 1) {
      this.productQuantity = this.productQuantity - 1
    }
  }

  increaseProduct() {
    if (this.productStock > this.productQuantity) {
      this.productQuantity = this.productQuantity + 1;
    }
  }

}
