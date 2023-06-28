import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, getDocs, query, where } from '@angular/fire/firestore';
;
import { ToastrService } from 'ngx-toastr';
import { CodeInformation } from '../models/code-information.model';

@Injectable({
  providedIn: 'root'
})
export class DiscountCodesService {

  constructor(private firestore: Firestore,
    private _toastr: ToastrService) { }


  async getCouponByCode(couponCode: string): Promise<CodeInformation> {
    try {
      const q = query(collection(this.firestore, 'discountCodes'), where('nombre', '==', couponCode));
      const cuponesSnapshot = await getDocs(q);
  
      if (!cuponesSnapshot.empty) {
        const cuponDoc = cuponesSnapshot.docs[0];
        const cuponData = cuponDoc.data();
        const cuponId = cuponDoc.id;
  
        if (cuponData['vigente']) {
          // El cupón está vigente, retornar información del cupón
          this._toastr.success('Código aplicado');
          return { id: cuponId, ...cuponData };
        } else {
          // El cupón no está vigente
          this._toastr.info('Ya no está vigente ese código.', 'Lo sentimos');
          return { id: cuponId, mensaje: 'El cupón no está vigente.' };
        }
      } else {
        // El cupón no existe
        this._toastr.error('El cupón "' + couponCode + '" no existe.', 'Error');
        return { id: '', mensaje: 'El cupón no existe.' };
      }
    } catch (error) {
      this._toastr.error('Hay un error al recuperar el código. Reintentar.', 'Error');
      console.error('Error al recuperar el cupón:', error);
      throw error;
    }
  }
}
