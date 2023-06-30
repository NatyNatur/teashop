import { Injectable } from '@angular/core';
import { addDoc, doc, getDoc, Firestore, collection, updateDoc, getDocs, orderBy, query, where, onSnapshot } from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../models/category.model';
import { Order } from '../models/order.model';
import { Auth } from '@angular/fire/auth';
import { Timestamp } from 'firebase/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private firestore: Firestore,
    private _toastr: ToastrService,
    private _auth: Auth) { }

  async createOrder(orderInfo: Order) {
    const user = this._auth.currentUser;
    const currentTimestamp = Timestamp.now();
    try {
      const orderDoc = await addDoc(collection(this.firestore, "orders"), {
        subtotal: orderInfo['subtotal'],
        envio: orderInfo['envio'],
        tipo_envio: orderInfo['tipo_envio'],
        sucursal: orderInfo['sucursal'],
        total: orderInfo['total'],
        estado: orderInfo['estado'],
        productos: orderInfo['productos'],
        cupon: orderInfo['cupon'],
        metodo: orderInfo['metodo'],
        usuario: orderInfo['usuario'],
        short_id: orderInfo['short_id'],
        userData: orderInfo['userData'],
        created_at: currentTimestamp,
      })
      this._toastr.success('Pedido creado correctamente', 'Listo');
      return true;
    }
    catch (error) {
      this._toastr.error('Hubo un error creando tu pedido.', 'Error');
      console.log(error);
      return false;
    }
  }

  async getAllOrders() {
    try {
      const ordersQuery = query(
        collection(this.firestore, 'orders'),
        orderBy('created_at', 'desc') // Ordenar por fecha de creación descendente
      );

      const querySnapshot = await getDocs(ordersQuery);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        const orderData = doc.data() as Order;
        const orderWithId = {
          id: doc.id,
          ...orderData
        };
        orders.push(orderWithId);
      });

      return orders;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async getUserOrders(userId: string) {
    try {
      const ordersQuery = query(
        collection(this.firestore, 'orders'),
        where('usuario', '==', userId), // Filtrar por UID de usuario
        orderBy('created_at', 'desc') // Ordenar por fecha de creación descendente
      );

      const querySnapshot = await getDocs(ordersQuery);
      const orders: Order[] = [];

      querySnapshot.forEach((doc) => {
        console.log(doc)
        const orderData = doc.data() as Order;
        orders.push(orderData);
      });

      return orders;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async updateOrderStatusWithID(orderInformationWithData: any) {
    try {
      const orderRef = doc(this.firestore, `orders/${orderInformationWithData['id']}`);
      await updateDoc(orderRef, {
        estado: orderInformationWithData['estado']
      })
      this._toastr.success('Estado actualizado correctamente', 'Listo');
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, estado no actualizado', 'Error')
      return false;
    }
  }

  async updateOrderStatus(orderInformationWithData: any) {
    try {
      const querySnapshot = await getDocs(query(collection(this.firestore, 'orders'),
        where('short_id', '==', orderInformationWithData['short_id'])));
      if (querySnapshot.size === 0) {
        this._toastr.error('Pedido no encontrado.', 'Error')
        throw new Error('Pedido no encontrado');
      }

      const orderDoc = querySnapshot.docs[0];

      // Actualizar el estado del pedido
      await updateDoc(orderDoc.ref, {
        estado: orderInformationWithData['estado']
      });

      this._toastr.success('Estado actualizado correctamente', 'Listo');
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, estado no actualizado', 'Error');
      return false;
    }
  }
}
