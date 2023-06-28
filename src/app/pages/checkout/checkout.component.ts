import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageFunctionsService } from 'src/app/local-storage-functions.service';
import { Order } from 'src/app/models/order.model';
import { ProductInCart, SimpleProduct } from 'src/app/models/product.model';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  userData: any;
  isDone: boolean = false;
  userProfile!: FormGroup;
  addOffice!: FormGroup;
  paymentOption: string = 'transferencia';
  shippingOption: string = 'domicilio';
  RM: string = 'Metropolitana de Santiago';
  shippingOptionPP: string = 'A domicilio (por pagar)';
  shippingCost: number = 0;
  officeOption: string = '';
  showAddOffice: boolean = false;

  productList: ProductInCart[] = [];

  infoCarrito: any;
  @ViewChild('modalConfirmOrder') modalConfirm?: ModalDirective;

  preOrder: Order = new Order;
  
  constructor(private _ls: LocalStorageFunctionsService,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _loader: LoaderService,
    private auth: AuthService,
    private _cart: CartService ) {
    this.createUserDataForm();
    this.createOfficeForm();
  }
  
  ngOnInit(): void {
    this.loadUserData();
    this.productList = this._cart.getCart();
    this.infoCarrito = JSON.parse(localStorage.getItem('datosCarrito') as any) || []
    console.log(this.infoCarrito)
    }

    createUserDataForm() {
      this.userProfile = this._formBuilder.group({
        telefono: [{ value: null }, [Validators.required, Validators.minLength(3), Validators.pattern("[0-9 ]{9}")]]
      })
    }
    
  
    private async loadUserData(): Promise<void> {
      const item = await this._ls.waitForItemInLocalStorage('userData');
      //const userDataString = localStorage.getItem('userData');
      if (item) {
        this.userData = JSON.parse(item);
        this.isDone = true;
        //this._loader.loaderOff();
        this.fillUserDataForm();
      }
    }

    get phone() {
      return this.userProfile?.get('telefono');
    }

    fillUserDataForm() {
      this.userProfile.patchValue({
        // email: this.userData.email,
        // nombre: this.userData.nombre,
        // apellido: this.userData.apellido,
        // comuna: this.userData.comuna,
        // direccion: this.userData.direccion,
        // tipoUsuario: this.userData.tipoUsuario,
        telefono: this.userData.telefono
      })
    }

    async onSubmitEditUserData() {
      if (!this.userProfile.valid) {
        this._toastr.error('Recuerda completar todos los campos correctamente.', 'Información no actualizada');
        return;
      }
      else {
        this._loader.loaderOn();
        this.auth.updatePhone(this.userProfile.getRawValue()).finally(()=>{
          this.auth.getUserProfile().subscribe((res)=> {
            this.userData = res;
            localStorage.setItem('userData', JSON.stringify(res));
            this.auth.loadUserProfile();
            });
            this._loader.loaderOff();
        })
      }
    }

    createOfficeForm() {
      this.addOffice = this._formBuilder.group({
        sucursal: [{ value: '' }, [Validators.required, Validators.minLength(3)]]
      })
      this.addOffice.patchValue({
        sucursal: ''
      })
    }

    async onSubmitAddOffice() {
      if (!this.addOffice.valid) {
        this._toastr.error('Recuerda ingresar el nombre de la sucursal.', 'Información no agregada.');
        return;
      }
      else {
        this.officeOption = this.addOffice.controls['sucursal'].value;
        this.addOffice.controls['sucursal'].patchValue('');
      }
    }

    selectPaymentOption() {
      if (this.paymentOption === 'contra') {
        this.shippingOption = 'entregaRM'
        this.selectShippingOption('Entrega a domicilio');
      }
    }

    selectShippingOption(name: string) {
      if (this.shippingOption === 'sucursalST' || this.shippingOption === 'sucursalCE')  {
        this.showAddOffice = true;
      } else {
        this.showAddOffice = false;
        this.officeOption = '';
      }

      if (name === 'Entrega a domicilio') {
        this.shippingCost = 2990;
      } else {
        this.shippingCost = 0;
      }
      this.shippingOptionPP = name;
    }

    convertProductInCartToSimpleProduct(productInCart: ProductInCart): SimpleProduct {
      const simpleProduct: SimpleProduct = {
        id: productInCart.id,
        product_name: productInCart.product_name,
        product_price: productInCart.product_price,
        product_imageUrl: productInCart.product_imageUrl,
        quantity: productInCart.quantity,
      };
    
      return simpleProduct;
    }

    confirmOrder() {
      this.preOrder.cupon = this.infoCarrito['datosCupon'];
      this.preOrder.subtotal = this.infoCarrito['subtotal'];
      this.preOrder.envio = this.shippingCost;
      this.preOrder.tipo_envio = this.shippingOption;
      this.preOrder.total = this.infoCarrito['total'] + this.shippingCost;
      this.preOrder.products = this.productList.map(this.convertProductInCartToSimpleProduct);;
      console.log(this.preOrder)
    }
}
