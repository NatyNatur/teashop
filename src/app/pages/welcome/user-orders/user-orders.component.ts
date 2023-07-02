import { Component, OnInit, ViewChild } from '@angular/core';
import { Order } from 'src/app/models/order.model';
import { OrdersService } from 'src/app/services/orders.service';
import { LoaderService } from '../../../services/loader.service';
import { Timestamp } from 'firebase/firestore';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-user-orders',
  templateUrl: './user-orders.component.html',
  styleUrls: ['./user-orders.component.css']
})
export class UserOrdersComponent implements OnInit {
  isDone: boolean = false;
  ordersList: Order[] = [];
  unsubscribe: any;
  private userId: string = '';

  orderDetails: Order = new Order;
  @ViewChild('seeOrderDetail') seeOrderDetail?: ModalDirective;

  constructor(private _orders: OrdersService,
    private _loader: LoaderService) {
    this.userId = localStorage.getItem('userId') || '';
  }

  ngOnInit(): void {
    this.getUserOrders();
  }

  getUserOrders() {
    this._loader.loaderOn();
    this._orders.getUserOrders(this.userId).then((res) => {
      this.ordersList = res;
      this.isDone = true;
      this._loader.loaderOff();
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
