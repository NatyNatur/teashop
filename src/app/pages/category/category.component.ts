import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product, ProductInCart } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  products: Product | undefined;
  productsList: Product[] = [];
  isReady: boolean = false;

  cat_id: string = '';
  cat_name: string = '';

  constructor(private _loader: LoaderService, 
    private _products: ProductsService, 
    private _route: ActivatedRoute,
    private _cart: CartService,
    private _toastr: ToastrService,
    private router: Router) {

  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      console.log(params)
      this.cat_name = params['name'];
      this.cat_id = params['id'];
      this.getProductsByCategory(this.cat_id);
    })
  }

  withQueryParams() {
    this._route.queryParams.subscribe((params) => {
      this.cat_id = params['id'];
      this.cat_name = params['name'];
      this.getProductsByCategory(this.cat_id);
    });
  }

  getProductsByCategory(id: string) {
    // const routeParams = this._route.snapshot.paramMap;
    // console.log(routeParams.get('name'))
    // const categoryIdFromRoute = routeParams.get('categoryId');
    // console.log(categoryIdFromRoute);
    this._products.getProductsByCategory(id).then((res)=> {
      this.productsList = res;
      console.log('by cat', res)
      
    }).finally(()=> {
      console.log('terminó')
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
    this._toastr.success('Producto agregado a tu carrito');
  }
}
