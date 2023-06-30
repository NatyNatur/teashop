import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Order } from 'src/app/models/order.model';
import { LoaderService } from 'src/app/services/loader.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  isDone: boolean = true;
  ordersList: Order[] = [];
  unsubscribe: any;

  orderDetails: Order = new Order;
  @ViewChild('seeOrderDetail') seeOrderDetail?: ModalDirective;
  @ViewChild('editOrderStatus') editOrderStatus?: ModalDirective;
  @ViewChild('editOrderStatusWithCode') editOrderStatusWithCode?: ModalDirective;


  orderInformation!: FormGroup;
  orderInformationWithData!: FormGroup;

  constructor(private _orders: OrdersService,
    private _loader: LoaderService,
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService) {
    this.createOrderInformationForm();
  }

  ngOnInit(): void {
    this.getOrders();
  }

  getOrders() {
    this._loader.loaderOn();
    this._orders.getAllOrders().then((res) => {
      this.ordersList = res;
      this._loader.loaderOff();
    })
  }

  createOrderInformationForm() {
    this.orderInformation = this._formBuilder.group({
      estado: [{ value: 'creado' }, [Validators.required]],
      short_id: [{ value: '' }, [Validators.required]],
    })

    this.orderInformationWithData = this._formBuilder.group({
      id: [{ value: '', disabled: true }, [Validators.required]],
      estado: [{ value: 'creado' }, [Validators.required]],
      short_id: [{ value: '', disabled: true }, [Validators.required]],
    })
  }

  get estado() {
    return this.orderInformation?.get('estado');
  }

  get short_id() {
    return this.orderInformation?.get('short_id');
  }

  openEditOrderStatusModal(order: Order) {
    this.orderDetails = order;
    this.fillOrderInformationForm();
    setTimeout(() => {
      this.editOrderStatusWithCode!.show()
    }, 200);
  }

  openEmptyEditOrderStatusModal() {
    this.emptyOrderInformationForm();
    setTimeout(() => {
      this.editOrderStatus!.show()
    }, 200);
  }

  async onSubmitOrderInformationWithData() {
    if (!this.orderInformationWithData.valid) {
      this._toastr.error('Recuerda completar todos los campos.', 'Información no actualizada');
      return;
    }
    else {
      this._loader.loaderOn();
      this._orders.updateOrderStatusWithID(this.orderInformationWithData.getRawValue()).then(() => {
        this.getOrders();
      }).finally(() => {
        this.editOrderStatusWithCode?.hide();
      })
    }
  }

  onSubmitOrderInformation() {
    if (!this.orderInformation.valid) {
      this._toastr.error('Recuerda completar todos los campos.', 'Información no actualizada');
      return;
    }
    else {
      this._loader.loaderOn();
      this._orders.updateOrderStatus(this.orderInformation.getRawValue()).then(() => {
        this.getOrders();
      }).finally(() => {
        this.editOrderStatus?.hide();
      })
    }
  }

  fillOrderInformationForm() {
    this.orderInformationWithData.patchValue({
      estado: this.orderDetails.estado,
      short_id: this.orderDetails.short_id,
      id: this.orderDetails.id
    })
  }

  emptyOrderInformationForm() {
    this.orderInformation.patchValue({
      estado: 'creado',
      short_id: '',
    })
  }

  convertShippingOption(shipping: string) {
    switch (shipping) {
      case 'domicilio': {
        return 'A domicilio (por pagar)'
      }
      case 'sucursalST': {
        return 'Sucursal Starken (por pagar)'
      }
      case 'sucursalCE': {
        return 'Sucursal Chilexpress (por pagar)'
      }
      case 'entregaRM':
        return 'Entrega a domicilio'
      default: {
        return 'Entrega a domicilio'
      }
    }
  }


  convertTimestampToDate(order: any) {
    const orderTimestamp = order.toDate(); // Convertir la marca de tiempo a un objeto Date
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const formattedDate = orderTimestamp.toLocaleDateString("es-ES", options);
    return formattedDate
  }

  convertTimestampToTime(order: any) {
    const orderTimestamp = order.toDate(); // Convertir la marca de tiempo a un objeto Date
    const formattedTime = orderTimestamp.toLocaleTimeString(); // Obtener la hora formateada como una cadena
    return formattedTime
  }

  setOrderDetail(order: Order) {
    this.orderDetails = order;
    this.seeOrderDetail?.show();
  }
}
