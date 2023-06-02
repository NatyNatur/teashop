import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BsModalService, ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Observable, map } from 'rxjs';
import { Category, Subcategory, SubcategoryToEdit, } from 'src/app/models/category.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { LoaderService } from 'src/app/services/loader.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  categoriesList: Category[] = [];
  subcategoriesList: any;
  newCategory: Category = new Category();
  category: Category = new Category();
  newSubcategory: SubcategoryToEdit = new SubcategoryToEdit();
  subcategory: SubcategoryToEdit = new SubcategoryToEdit();
  // subcategoriesList : CategoriesList = new CategoriesList();

  @ViewChild('newCategoryModal') newCategoryModal?: ModalDirective;
  @ViewChild('deleteCategoryModal') deleteCategoryModal?: ModalDirective;
  @ViewChild('editCategoryModal') editCategoryModal?: ModalDirective;
  @ViewChild('newSubcategoryModal') newSubcategoryModal?: ModalDirective;
  @ViewChild('editSubcategoryModal') editSubcategoryModal?: ModalDirective;
  @ViewChild('deleteSubcategoryModal') deleteSubcategoryModal?: ModalDirective;


  categoryName: string = '';
  categoryId: string = ''
  subcategoryId: string = '';


  constructor(private modalService: BsModalService,
    private categories: CategoriesService,
    private _toastr: ToastrService,
    private _loader: LoaderService) {

  }
  ngOnInit(): void {
    this._loader.loaderOn();
    this.getCategories();

  }


  async getCategories(): Promise<void> {
    //this.categoriesList = [];
    // this.categories.readCategories().then( (res: any) => {
    //   console.log(res);
    //   this.categoriesList = res;
    //   this._loader.loaderOff();
    // })
    this.categories.readSubcategories().then((res: any) => {
      console.log(res);
      this.categoriesList = res;
      console.log('subcategoriesList', this.categoriesList);
      this._loader.loaderOff();
    }).catch((error) => {
      console.error('Error al leer los datos:', error);
      this._loader.loaderOff();
    });
  }

  getAllCategoriesObs() {
    this.categories.readAllSubcategories().subscribe((allCats: Category[]) => {
      console.log(allCats);
      //this.categoriesList = allCats;
      this._loader.loaderOff();
    })
  }

  showDeleteCategoryModal(name: string, id: string) {
    this.categoryName = name;
    this.categoryId = id;
    this.deleteCategoryModal?.show();
  }

  deleteCategory(id: string) {
    this._loader.loaderOn();
    this.categories.deleteCategory(id).then(() => {
      this.deleteCategoryModal?.hide();
      this.updateCategoriesList(id);
      this._loader.loaderOff();
    }).catch((error) => {
      console.error('Error al eliminar los datos:', error);
      this._loader.loaderOff();
    });;
  }

  updateCategoriesList(id: string){
   //this is for update the list when a category is deleted
    this.categoriesList = this.categoriesList.filter((category: any) => category.category_id !== id);
  }

  async onSubmitCategory(categoryForm: NgForm) {
    if (categoryForm.invalid) { return; }
    else {
      this._loader.loaderOn();
      this.categories.createCategory(this.newCategory).then(() => {
        this.getCategories();
        categoryForm.resetForm();
        //this.modalNewCategory?.hide();
        this.newCategoryModal?.hide();
        //this._loader.loaderOff();
      }).catch((error) => {
        console.error('Error al insertar los datos:', error);
        this._loader.loaderOff();
      });;
    }
  }

  showEditCategoryModal(name: string, id: string, status: string) {
    this.category.category_name = name;
    this.category.category_status = status;
    this.category.category_id = id;
    this.editCategoryModal?.show();
  }

  resetForm(categoryForm: NgForm) {
    categoryForm.resetForm();
  }

  async onSubmitUpdateCategory(categoryForm: NgForm) {
    if (categoryForm.invalid) { return; }
    else {
      this._loader.loaderOn();
      this.categories.updateCategory(this.category.category_id, this.category).then(() => {
        this.getCategories();
        this.resetForm(categoryForm);
        //this.modalNewCategory?.hide();
        this.editCategoryModal?.hide();
        //this._loader.loaderOff();
      }).catch((error) => {
        console.error('Error al actualizar los datos:', error);
        this._loader.loaderOff();
      });
    }
  }

  showNewSubcategory(category: Category) {
    this.newSubcategory.category_name = category.category_name;
    this.newSubcategory.category_id = category.category_id
    this.newSubcategory.category_status = category.category_status
    this.newSubcategoryModal?.show();
  }

  async onSubmitSubcategory(subcategoryForm: NgForm) {
    if (subcategoryForm.invalid) { return; }
    else {
      this._loader.loaderOn();
      this.categories.createSubcategory(this.newSubcategory).then(() => {
        this.getCategories();
        subcategoryForm.resetForm();
        //this.modalNewCategory?.hide();
        this.newSubcategoryModal?.hide();
        //this._loader.loaderOff();
      }).catch((error) => {
        console.error('Error al insertar los datos:', error);
        this._loader.loaderOff();
      });
    }
  }

  showEditSubcategoryModal(category: Category, subid: string, subname: string, substatus: string) {
    this.subcategory.category_id = category.category_id;
    this.subcategory.category_name = category.category_name;
    this.subcategory.category_status = category.category_status;
    this.subcategory.subcategory_id = subid;
    this.subcategory.subcategory_name = subname;
    this.subcategory.subcategory_status = substatus;
    this.editSubcategoryModal?.show();
  }

  async onSubmitUpdateSubcategory(subcategoryForm: NgForm) {
    if (subcategoryForm.invalid) { return; }
    else {
      this._loader.loaderOn();
      const actualizar = await this.categories.updateSubcategory(this.subcategory);
      if (actualizar) {
          await this.getCategories().then(()=> {
            this.resetForm(subcategoryForm);
            this.editSubcategoryModal?.hide();
          })
        }
      else {
        console.log('act falso');
        this._loader.loaderOff()
      }

    }
  }

  showDeleteSubcategoryModal(name: string, category_id: string, subcategory_id: string) {
    this.categoryName = name;
    this.categoryId = category_id;
    this.subcategoryId = subcategory_id;
    this.deleteSubcategoryModal?.show();
  }

  deleteSubcategory(category_id: string, subcategory_id: string) {
    this._loader.loaderOn();
    this.categories.deleteSubcategory(category_id, subcategory_id).then(() => {
      this.getCategories();
      this.deleteSubcategoryModal?.hide();
      //this._loader.loaderOff();
    }).catch((error) => {
      console.error('Error al eliminar los datos:', error);
      this._loader.loaderOff();
    });
  }
}
