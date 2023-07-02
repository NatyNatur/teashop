import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { CodeInformation } from 'src/app/models/code-information.model';
import { Product, ProductInCart } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { DiscountCodesService } from 'src/app/services/discount-codes.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  productList: ProductInCart[] = [];
  productQuantity: number = 0;
  subtotal: number = 0;
  exceedsStock: boolean = false;
  @ViewChild('modalConfirm') modalConfirm?: ModalDirective;
  @ViewChild('isNotAuthenticated') isNotAuthenticated?: ModalDirective;
  @ViewChild('doesntHaveAnAccount') doesntHaveAnAccount?: ModalDirective;
  @ViewChild('modalCart') modalCart?: ModalDirective;

  @ViewChildren('alertContainers') alertContainers!: QueryList<ElementRef>;

  discountCode: string = '';
  discountCodeInfo: CodeInformation = new CodeInformation;
  discountAmount: number = 0;
  discountRate: number = 0;
  total: number = 0;


  constructor(private _cart: CartService,
    private _auth: AuthService,
    private _toastr: ToastrService,
    private _router: Router,
    private _discountCodes: DiscountCodesService) {
  }

  ngOnInit(): void {
    this.getCartList();
  }

// con input manejable
  ngAfterViewInit() {
    this.checkContainerForStock();
  }

  checkContainerForStock() {
    this.alertContainers.forEach((alertContainerRef: ElementRef) => {
      const alertContainer = alertContainerRef.nativeElement as HTMLElement;
      const isVisible = this.isElementVisible(alertContainer);
      if (isVisible) {
        this.exceedsStock = true;
      }
    });
  }

  isElementVisible(container: HTMLElement): boolean {
    const message = container.querySelector('.text-danger') as HTMLElement;
    if (message && message.offsetParent !== null) {
      return true; // El mensaje está visible
    }
    return false; // El mensaje está oculto
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
    this.total = this.subtotal;
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
    this.subtotal = 0
    this.total = 0;
    this.discountAmount = 0;
    this.discountRate = 0;
    this.modalCart?.hide();
  }

  checkStock() {
    this.checkContainerForStock();
    if (this.exceedsStock) {
      this._toastr.error('Uno o varios productos exceden el stock', 'No podemos continuar')
    } else {
      this.modalConfirm?.show()
    }
  }

  confirm(): void {
    let token = localStorage.getItem('token') || '';
    let isAuthenticated = this._auth.isAuthenticated();
    localStorage.setItem('datosCarrito', JSON.stringify({
      'subtotal': this.subtotal, 
      'total': this.total,
      'datosCupon': this.discountCodeInfo,
      'valor': this.discountAmount,
    }));
    if (token === '') {
      this.modalConfirm?.hide();
      this.doesntHaveAnAccount?.show();
    }
    else {
      if (isAuthenticated) {
        this._router.navigate(['/checkout']);
      }
      else {
        this.modalConfirm?.hide();
        this.isNotAuthenticated?.show();
      }
    }
  }

  checkDiscountCode() {
    if (this.discountCode != '') {
      this._discountCodes.getCouponByCode(this.discountCode).then((res) => {
        this.discountCodeInfo = res;
        this.discountRate = this.discountCodeInfo['monto'] || 0;
        this.discountAmount = this.subtotal * (this.discountRate / 100 );
        this.total = this.subtotal - this.discountAmount;
      }).finally(() => {
        this.discountCode = '';
      })
    }
  }

  showModalCart() {
    this.modalCart?.show();
  }

  decreaseProduct(product: any) {
    if (product.quantity > 1) {
      product.quantity = product.quantity - 1
    }
    this.onChangeQuantity(product.quantity, product)
    this.addSubtotal();
  }

  increaseProduct(product: any) {
    let productStock = product.product_stock
    if (productStock > product.quantity) {
      product.quantity= product.quantity + 1;
    } else {
      this._toastr.info('No tenemos más stock disponible.', 'Lo sentimos.');
    }
    this.onChangeQuantity(product.quantity, product)
    this.addSubtotal();
  }
}
