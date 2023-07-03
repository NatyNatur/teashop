import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
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
  
        if (cuponData['vigente'] === 'Sí') {
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

  async readAllCodes() {
    const querySnapshot = await getDocs(collection(this.firestore, "discountCodes"));
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });
    let itemsArr: { id: string; }[] = [];
    querySnapshot.forEach((doc) => {
      const dataDoc = doc.data();
      const id = doc.id;
      itemsArr.push({ id, ...dataDoc });
    });
    return itemsArr;
  }

  async createDiscountCode(newCodeInfo: any) {
    try {
      const codeDoc = await addDoc(collection(this.firestore, "discountCodes"), {
        monto: newCodeInfo['monto'],
        nombre: newCodeInfo['nombre'],
        vigente: newCodeInfo['vigente'],
      })
      this._toastr.success('Código de descuento creado correctamente', 'Listo');
      return true;
    }
    catch (error) {
      this._toastr.error('Hubo un error creando tu código.', 'Error');
      console.log(error);
      return false;
    }
  }

  async updateDiscountCode(editCodeInfo: any) {
    try {
      const codeRef = doc(this.firestore, `discountCodes/${editCodeInfo['id']}`);
      await updateDoc(codeRef, {
        nombre: editCodeInfo['nombre'],
        monto: editCodeInfo['monto'],
        vigente: editCodeInfo['vigente']
      })
      this._toastr.success('Código actualizado correctamente', 'Listo');
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, código no actualizado', 'Error')
      return false;
    }
  }

  async deleteDiscountCode(code_id: string) {
    try {
      const codeRef = doc(this.firestore, "discountCodes", code_id);
      await deleteDoc(codeRef);
      this._toastr.success('Código eliminado correctamente', 'Listo')
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, código no eliminado', 'Error')
      return false;
    }
  }

}
