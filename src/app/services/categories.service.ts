import { Injectable } from '@angular/core';
import { addDoc, doc, getDoc, Firestore, collection, updateDoc, getDocs, deleteDoc } from '@angular/fire/firestore';
import { Category, Subcategory, SubcategoryToEdit } from '../models/category.model';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, from } from 'rxjs';
import { map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private firestore: Firestore, private _toastr: ToastrService) { }

  async createCategory(categoryInfo: Category) {
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(this.firestore, "categories"), {
        category_name: categoryInfo['category_name'],
        category_status: categoryInfo['category_status']
      });
      //console.log("Document written with ID: ", docRef.id);
      this._toastr.success('Categoría creada correctamente', 'Listo');
      return true;
    }
    catch (error) {
      this._toastr.error('Hubo un error, categoría no creada', 'Error')
      console.log(error);
      return false;
    }
  }

  async createSubcategory(categoryInfo: SubcategoryToEdit) {
    try {
      // Add a new document with a generated id.
      const docRef = await addDoc(collection(this.firestore, "categories", categoryInfo.category_id, 'subcategories'), {
        subcategory_name: categoryInfo['subcategory_name'],
        subcategory_status: categoryInfo['subcategory_status']
      });
      //console.log("Document written with ID: ", docRef.id);
      this._toastr.success('Categoría creada correctamente', 'Listo');
      return true;
    }
    catch (error) {
      this._toastr.error('Hubo un error, categoría no creada', 'Error')
      console.log(error);
      return false;
    }
  }

  async readCategories() {
    const querySnapshot = await getDocs(collection(this.firestore, "categories"));
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // });
    let itemsArr: { category_id: string; }[] = [];
    querySnapshot.forEach((doc) => {
      const dataDoc = doc.data();
      const category_id = doc.id;
      itemsArr.push({ category_id, ...dataDoc });
    });
    return itemsArr;
  }

  async readSubcategories() {
    const querySnapshot = await getDocs(collection(this.firestore, "categories"));
    let itemsArr: { category_id: string; subcategories: any[] }[] = [];

    for (const doc of querySnapshot.docs) {
      const category_id = doc.id;
      const dataDoc = doc.data();

      // Obtener las subcolecciones de la categoría
      const subcollectionsSnapshot = await getDocs((collection(this.firestore, "categories", category_id, "subcategories")));

      let subcategories: any[] = [];
      for (const subcollection of subcollectionsSnapshot.docs) {
        const subcategory_id = subcollection.id;
        const subcollectionData = subcollection.data();
        subcategories.push({ subcategory_id, ...subcollectionData });
      }

      itemsArr.push({ category_id, ...dataDoc, subcategories });
    }

    return itemsArr;
  }

  readAllSubcategories(): Observable<Category[]> {
    return from(getDocs(collection(this.firestore, 'categories'))).pipe(
      map((querySnapshot) => {
        const categories: Category[] = [];
  
        querySnapshot.forEach((doc) => {
          const category_id = doc.id;
          const dataDoc = doc.data();
  
          // Obtener las subcolecciones de la categoría
          const subcollectionsSnapshot = getDocs(collection(this.firestore, 'categories', category_id, 'subcategories'));
  
          const subcategories: Subcategory[] = [];
          subcollectionsSnapshot.then((subcollections) => {
            subcollections.forEach((subcollection) => {
              const subcategory_id = subcollection.id;
              const subcollectionData = subcollection.data();
              const subcategory: Subcategory = {
                subcategory_id,
                subcategory_name: subcollectionData['subcategory_name'],
                subcategory_status: subcollectionData['subcategory_status'],
              };
              subcategories.push(subcategory);
            });
  
            const category: Category = {
              category_id,
              category_name: dataDoc['category_name'],
              category_status: dataDoc['category_status'],
              subcategories,
            };
  
            categories.push(category);
          });
        });
  
        return categories;
      })
    );
  }


  async updateCategory(category_id: string, categoryInfo: Category) {
    try {
      const cateRef = doc(this.firestore, "categories", category_id);
      this.updateSubcategoriesStatus(category_id, categoryInfo['category_status'] );
      await updateDoc(cateRef, {
        category_name: categoryInfo['category_name'],
        category_status: categoryInfo['category_status']
      });
      this._toastr.success('Categoría actualizada correctamente', 'Listo')
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, categoría no actualizada', 'Error')
      return false;
    }
  }

  async updateSubcategoriesStatus(category_id: string, status: string) {
    try {
      const subcollectionsSnapshot = await getDocs((collection(this.firestore, "categories", category_id, "subcategories")));
      subcollectionsSnapshot.forEach(async (doc) => {
        //console.log(doc)
        const subcategoriaRef = doc.ref;
        await updateDoc(subcategoriaRef, { subcategory_status: status });
      });
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, estado de categoría no actualizada', 'Error')
      return false;
    }
  }
  

  async updateSubcategory(subcategory: SubcategoryToEdit) {
    if (subcategory.category_status === 'inactive' && subcategory.subcategory_status === 'active') {
      this._toastr.error('Subcategoría no actualizada ya que categoría está inactiva', 'Error');
      return false;
    }
    try {
      const cateRef = doc(this.firestore, "categories", subcategory.category_id, "subcategories", subcategory.subcategory_id);
      await updateDoc(cateRef, {
        subcategory_name: subcategory['subcategory_name'],
        subcategory_status: subcategory['subcategory_status']
      });
      this._toastr.success('Subcategoría actualizada correctamente', 'Listo')
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, subcategoría no actualizada', 'Error')
      return false;
    }
  }

  async deleteCategory(category_id: string) {
    try {
      const cateRef = doc(this.firestore, "categories", category_id);
      await deleteDoc(cateRef);
      this._toastr.success('Categoría eliminada correctamente', 'Listo')
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, categoría no eliminada', 'Error')
      return false;
    }
  }

  async deleteSubcategory(category_id: string, subcategory_id: string) {
    try {
      const cateRef = doc(this.firestore, "categories", category_id, "subcategories", subcategory_id);
      await deleteDoc(cateRef);
      this._toastr.success('Subcategoría eliminada correctamente', 'Listo')
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, subcategoría no eliminada', 'Error')
      return false;
    }
  }
}
