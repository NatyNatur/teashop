import { Injectable } from '@angular/core';
import { addDoc, doc, getDoc, Firestore, collection, updateDoc, getDocs, deleteDoc, query, where } from '@angular/fire/firestore';
import { Category, Subcategory, SubcategoryToEdit } from '../models/category.model';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, from } from 'rxjs';
import { last, map, mergeMap, switchMap } from 'rxjs/operators';
import { Storage, ref, deleteObject} from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categoriesList: Category[] = [];

  constructor(private firestore: Firestore, private _toastr: ToastrService, private storage: Storage) { }

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
      this._toastr.success('Subcategoría creada correctamente', 'Listo');
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

  // async readSubcategories() {
  //   const querySnapshot = await getDocs(collection(this.firestore, "categories"));
  //   let itemsArr: { category_id: string; subcategories: any[] }[] = [];

  //   for (const doc of querySnapshot.docs) {
  //     const category_id = doc.id;
  //     const dataDoc = doc.data();

  //     // Obtener las subcolecciones de la categoría
  //     const subcollectionsSnapshot = await getDocs((collection(this.firestore, "categories", category_id, "subcategories")));

  //     let subcategories: any[] = [];
  //     for (const subcollection of subcollectionsSnapshot.docs) {
  //       const subcategory_id = subcollection.id;
  //       const subcollectionData = subcollection.data();
  //       subcategories.push({ subcategory_id, ...subcollectionData });
  //     }

  //     itemsArr.push({ category_id, ...dataDoc, subcategories });
  //   }

  //   return itemsArr;
  // }

  async readSubcategories(): Promise<Category[]> {
    const querySnapshot = await getDocs(collection(this.firestore, 'categories'));
    const categories: Category[] = [];

    for (const doc of querySnapshot.docs) {
      const category_id = doc.id;
      const dataDoc = doc.data();

      // Obtener las subcolecciones de la categoría y ordenarlas por nombre
      const subcollectionsSnapshot = await getDocs(collection(this.firestore, 'categories', category_id, 'subcategories'));
      const subcategories: Subcategory[] = subcollectionsSnapshot.docs.map((subcollection) => {
        const subcategory_id = subcollection.id;
        const subcollectionData = subcollection.data();
        return {
          subcategory_id,
          subcategory_name: subcollectionData['subcategory_name'],
          subcategory_status: subcollectionData['subcategory_status'],
        };
      });

      // Ordenar las subcategorías alfabéticamente según su nombre
      subcategories.sort((a, b) => a.subcategory_name.localeCompare(b.subcategory_name));

      const category: Category = {
        category_id,
        category_name: dataDoc['category_name'],
        category_status: dataDoc['category_status'],
        subcategories,
      };

      categories.push(category);
    }

    // Ordenar las categorías alfabéticamente según su nombre
    categories.sort((a, b) => a.category_name.localeCompare(b.category_name));

    return categories;
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

  readAllOrderedSubcategories(): Observable<Category[]> {
    return from(getDocs(collection(this.firestore, 'categories'))).pipe(
      switchMap((querySnapshot) => {
        const categories: Category[] = [];

        return from(querySnapshot.docs).pipe(
          mergeMap((doc) => {
            const category_id = doc.id;
            const dataDoc = doc.data();

            // Obtener las subcolecciones de la categoría
            const subcollectionsSnapshot = getDocs(collection(this.firestore, 'categories', category_id, 'subcategories'));

            return from(subcollectionsSnapshot).pipe(
              map((subcollections) => {
                const subcategories: Subcategory[] = [];

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

                // Ordenar las subcategorías alfabéticamente según su nombre
                subcategories.sort((a, b) => a.subcategory_name.localeCompare(b.subcategory_name));

                const category: Category = {
                  category_id,
                  category_name: dataDoc['category_name'],
                  category_status: dataDoc['category_status'],
                  subcategories,
                };

                categories.push(category);
              })
            );
          }),
          last(),
          map(() => {
            // Ordenar las categorías alfabéticamente según su nombre
            categories.sort((a, b) => a.category_name.localeCompare(b.category_name));
            return categories;
          })
        );
      })
    );
  }

  executeGetCategoriesForShop() {
    this.readAllOrderedSubcategories().subscribe((allCats: Category[]) => {
      this.categoriesList = allCats
    })
  }

  getCategoriesList() {
    return this.categoriesList;
  }


  async updateCategory(category_id: string, categoryInfo: Category) {
    try {
      const cateRef = doc(this.firestore, "categories", category_id);
      this.updateSubcategoriesStatus(category_id, categoryInfo['category_status']);
      await updateDoc(cateRef, {
        category_name: categoryInfo['category_name'],
        category_status: categoryInfo['category_status']
      });

      // Actualizar el estado de los productos asociados a la categoría
      await this.updateProductsStatusByCategories(category_id, categoryInfo['category_status']);

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

      // Actualizar el estado de los productos asociados a la subcategoría
      await this.updateProductsStatusBySubcategories(subcategory.category_id, subcategory.subcategory_id, subcategory.subcategory_status);

      this._toastr.success('Subcategoría actualizada correctamente', 'Listo')
      return true;
    }
    catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, subcategoría no actualizada', 'Error')
      return false;
    }
  }

  async updateProductsStatusByCategories(category_id: string, status: string) {
    try {
      const productsQuerySnapshot = await getDocs(query(collection(this.firestore, "products"), where("product_category", "==", category_id)));
      productsQuerySnapshot.forEach(async (doc) => {
        const productRef = doc.ref;
        await updateDoc(productRef, { product_status: status });
      });
      return true;
    } catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, estado de productos no actualizado', 'Error');
      return false;
    }
  }

  async updateProductsStatusBySubcategories(category_id: string, subcategory_id: string, status: string) {
    try {
      const productsQuerySnapshot = await getDocs(query(collection(this.firestore, "products"), where("product_category", "==", category_id), where("product_subcategory", "==", subcategory_id)));
      productsQuerySnapshot.forEach(async (doc) => {
        const productRef = doc.ref;
        await updateDoc(productRef, { product_status: status });
      });
      return true;
    } catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, estado de productos no actualizado', 'Error');
      return false;
    }
  }

  // async deleteCategory(category_id: string) {
  //   try {
  //     const cateRef = doc(this.firestore, "categories", category_id);
  //     await deleteDoc(cateRef);
  //     this._toastr.success('Categoría eliminada correctamente', 'Listo')
  //     return true;
  //   }
  //   catch (error) {
  //     console.log(error);
  //     this._toastr.error('Hubo un error, categoría no eliminada', 'Error')
  //     return false;
  //   }
  // }

  async deleteCategory(category_id: string) {
    try {
      const categoryRef = doc(this.firestore, 'categories', category_id);
      const subcategoriesSnapshot = await getDocs(collection(this.firestore, 'categories', category_id, 'subcategories'));
  
      const deletionPromises = [];
  
      subcategoriesSnapshot.forEach((subcategoryDoc) => {
        const subcategory_id = subcategoryDoc.id;
        const subcategoryRef = doc(this.firestore, 'categories', category_id, 'subcategories', subcategory_id);
        const productsPromise = getDocs(collection(this.firestore, 'products'))
          .then((productsSnapshot) => {
            productsSnapshot.forEach((productDoc) => {
              const productData = productDoc.data();
              if (productData['product_category'] === category_id && productData['product_subcategory'] === subcategory_id) {
                const productRef = doc(this.firestore, 'products', productDoc.id);
                deletionPromises.push(deleteDoc(productRef));

                const product_imageurl = productData['product_imageurl'];
                const path = `products/${productDoc.id}/${product_imageurl}`;
                const storageRef = ref(this.storage, path);
                deletionPromises.push(deleteObject(storageRef));

              } else if (productData['product_category'] === category_id && !productData['product_subcategory']) {
                const productRef = doc(this.firestore, 'products', productDoc.id);
                deletionPromises.push(deleteDoc(productRef));

                const product_imageurl = productData['product_imageurl'];
                const path = `products/${productDoc.id}/${product_imageurl}`;
                const storageRef = ref(this.storage, path);
                deletionPromises.push(deleteObject(storageRef));
              }
            });
          });
  
        const subcategoryPromise = deleteDoc(subcategoryRef);
  
        deletionPromises.push(productsPromise, subcategoryPromise);
      });
  
      deletionPromises.push(deleteDoc(categoryRef));
  
      await Promise.all(deletionPromises);
  
      this._toastr.success('Categoría eliminada correctamente', 'Listo');
      return true;
    } catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, categoría no eliminada', 'Error');
      return false;
    }
  }

  // async deleteSubcategory(category_id: string, subcategory_id: string) {
  //   try {
  //     const cateRef = doc(this.firestore, "categories", category_id, "subcategories", subcategory_id);
  //     await deleteDoc(cateRef);
  //     this._toastr.success('Subcategoría eliminada correctamente', 'Listo')
  //     return true;
  //   }
  //   catch (error) {
  //     console.log(error);
  //     this._toastr.error('Hubo un error, subcategoría no eliminada', 'Error')
  //     return false;
  //   }
  // }

  async deleteSubcategory(category_id: string, subcategory_id: string) {
    try {
      const deletionPromises = [];
      const subcategoryRef = doc(this.firestore, 'categories', category_id, 'subcategories', subcategory_id);
      const productsSnapshot = await getDocs(collection(this.firestore, 'products'));
      
      productsSnapshot.forEach((productDoc) => {
        const productData = productDoc.data();
        if (productData['product_category'] === category_id && productData['product_subcategory'] === subcategory_id) {
          const productRef = doc(this.firestore, 'products', productDoc.id);
          deletionPromises.push(deleteDoc(productRef));

          const product_imageurl = productData['product_imageurl'];
          const path = `products/${productDoc.id}/${product_imageurl}`;
          const storageRef = ref(this.storage, path);
          deletionPromises.push(deleteObject(storageRef));
        }
      });
      
      const subcategoryPromise = deleteDoc(subcategoryRef);
  
      deletionPromises.push(subcategoryPromise);
  
      await Promise.all(deletionPromises);
  
      this._toastr.success('Subcategoría eliminada correctamente', 'Listo');
      return true;
    } catch (error) {
      console.log(error);
      this._toastr.error('Hubo un error, subcategoría no eliminada', 'Error');
      return false;
    }
  }
}
