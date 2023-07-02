import { Injectable } from '@angular/core';
import { addDoc, doc, getDoc, Firestore, collection, getDocs, query, where, QuerySnapshot, onSnapshot } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  userCountObs: number = 0;

  constructor(private firestore: Firestore,
    private _toastr: ToastrService) { }


  obtainUserCount(): Observable<number> {
    const collectionRef = collection(this.firestore, 'usuarios');
    const q = query(collectionRef, where('tipoUsuario', '==', 'cliente'));

    return new Observable<number>(observer => {
      const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
        observer.next(querySnapshot.size); // Número de documentos en la consulta
      });

      return () => unsubscribe();
    });

  }

  getUserCount() {
    return this.userCountObs;
  }


  obtainProductsCount(): Observable<number> {
    const collectionRef = collection(this.firestore, 'products');;

    return new Observable<number>(observer => {
      const unsubscribe = onSnapshot(collectionRef, (querySnapshot: QuerySnapshot) => {
        observer.next(querySnapshot.size); // Número de documentos en la consulta
      });

      return () => unsubscribe();
    });
  }

  obtainNewOrders(): Observable<number> {
    const collectionRef = collection(this.firestore, 'orders');
    const q = query(collectionRef, where('estado', '==', 'creado'));

    return new Observable<number>(observer => {
      const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
        observer.next(querySnapshot.size); // Número de documentos en la consulta
      });

      return () => unsubscribe();
    });
  }

  obtainDiscountCodes(): Observable<number> {
    const collectionRef = collection(this.firestore, 'discountCodes');
    const q = query(collectionRef, where('vigente', '==', 'Sí'));

    return new Observable<number>(observer => {
      const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
        observer.next(querySnapshot.size); // Número de documentos en la consulta
      });

      return () => unsubscribe();
    });
  }
}
