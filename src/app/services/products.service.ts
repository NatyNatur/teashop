import { Injectable } from '@angular/core';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject} from '@angular/fire/storage';
import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { Product } from '../models/product.model';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  constructor(private storage: Storage, private firestore: Firestore, private _toastr: ToastrService) { }

  async createProduct(productInfo: Product, selectedFile: any) {
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(this.firestore, "products"), {
        product_name: productInfo['product_name'],
        product_description: productInfo['product_description'],
        product_price: productInfo['product_price'],
        product_stock: productInfo['product_stock'],
        product_featured: productInfo['product_featured'],
        product_category: productInfo['product_category'],
        product_subcategory: productInfo['product_subcategory']
      });
      //console.log("Document written with ID: ", docRef.id);
      
      this.uploadImage(selectedFile, docRef)
      this._toastr.success('Producto creado correctamente.', 'Listo');
      return true;
    }
    catch (error) {
      this._toastr.error('Hubo un error, producto no creado', 'Error');
      console.log(error);
      return false;
    }
  }

  async uploadImage(selectedFile: File, productRef: any) {
    const product_imageName = selectedFile.name;
    const path = `products/${productRef.id}/${selectedFile.name}`;
    const storageRef = ref(this.storage, path)
    try {
      await uploadBytes(storageRef, selectedFile);
      const product_imageUrl = await getDownloadURL(storageRef);
      const productDocRef = doc(this.firestore, `products/${productRef.id}/`);

      await setDoc(productDocRef, {
        product_imageUrl,
        product_imageName
      }, 
      // no sobreescribir los datos, solo el que se manda
      { merge: true })
      return true;
    }
    catch (error) {
      return false;
    }
  }
  

  async readProducts() {
    const querySnapshot = await getDocs(collection(this.firestore, "products"));
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

  getProductsObs(): Observable<Product[]> {
    const productRef = collection(this.firestore, "products");

    return collectionData(productRef, {idField: 'id'}) as Observable<Product[]>
  }

  async updateProduct(product_id: string, productInfo: Product, selectedFile?: any) {
    try {
      const productRef = doc(this.firestore, "products", product_id);
      await updateDoc(productRef, {
        product_name: productInfo['product_name'],
        product_description: productInfo['product_description'],
        product_price: productInfo['product_price'],
        product_stock: productInfo['product_stock'],
        product_featured: productInfo['product_featured'],
        product_category: productInfo['product_category'],
        product_subcategory: productInfo['product_subcategory'],
      });
      if (selectedFile) {
        this.uploadImage(selectedFile, productRef)
      }
      this._toastr.success('Producto actualizado correctamente.', 'Listo');
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, producto no actualizado', 'Error');
      return false;
    }
  }

  async deleteProduct(product_id: string, product_imageurl: string) {
    try {
      const productRef = doc(this.firestore, "products", product_id);

      const path = `products/${product_id}/${product_imageurl}`;
      const storageRef = ref(this.storage, path);

      await deleteDoc(productRef);

      deleteObject(storageRef)
      .then(() => {
        console.log('La foto se eliminó correctamente');
      })
      .catch((error) => {
        console.error('Error al eliminar la foto:', error);
      });
      this._toastr.success('Producto eliminado correctamente.', 'Listo');
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, producto no eliminado', 'Error');
      return false;
    }
  }

  async getFeaturedProducts() {
      const querySnapshot = await getDocs(collection(this.firestore, "products"));
      const itemsArr: { id: string }[] = [];
    
      querySnapshot.forEach((doc) => {
        const dataDoc = doc.data();
        const id = doc.id;
        
        // Verificar si el producto está destacado
        if (dataDoc['product_featured'] === 'Si') {
          itemsArr.push({ id, ...dataDoc });
        }
      });
    
      return itemsArr;
    }

    async getProductsByCategory(category: string) {
      try {
        const q = query(collection(this.firestore, 'products'), where('product_category', '==', category));
        const productosSnapshot = await getDocs(q);
    
        const productos: any[] = [];

        productosSnapshot.forEach((doc) => {
          const dataDoc = doc.data();
          const id = doc.id;
          productos.push({ id, ...dataDoc });
        });
    
        return productos;
      } catch (error) {
        console.error('Error al recuperar productos:', error);
        throw error;
      }
    }

    
    async getProductsByCategoryAndSub(id: string) {
      try {
        const q = query(collection(this.firestore, 'products'), where('product_category', '==', id));
        const r = query(collection(this.firestore, 'products'), where('product_subcategory', '==', id))
        const [productosSnapshotCat, productosSnapshotSubCat] = await Promise.all([
          getDocs(q),
          getDocs(r)
        ]);
    
        const productos: any[] = [];

        // const combinedResults = [
        //   ...categoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        //   ...subcategoriesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        // ];

        productosSnapshotCat.forEach((doc) => {
          const dataDoc = doc.data();
          const id = doc.id;
          productos.push({ id, ...dataDoc });
        });

        productosSnapshotSubCat.forEach((doc) => {
          const dataDoc = doc.data();
          const id = doc.id;
          productos.push({ id, ...dataDoc });
        });
    
        return productos;
      } catch (error) {
        console.error('Error al recuperar productos:', error);
        throw error;
      }
    }

}
