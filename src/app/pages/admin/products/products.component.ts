import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Product } from 'src/app/models/product.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { LoaderService } from 'src/app/services/loader.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  productsList: any;
  newProduct: Product = new Product();
  product: Product = new Product();
  categoriesList: any[] = [];
  subcategoriesList: any[] = [];

  selectedFile: File | undefined;
  @ViewChild('addProductModal') addProductModal?: ModalDirective;
  @ViewChild('editProductModal') editProductModal?: ModalDirective;
  @ViewChild('deleteProductModal') deleteProductModal?: ModalDirective;
  
  productName: string | undefined;
  productImageName: string= '';
  productId: string = '';

  constructor(private _loader: LoaderService,
    private _products: ProductsService, private _categories: CategoriesService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  async getCategories(): Promise<void> {
    this._categories.readSubcategories().then( (res: any) => {
      this.categoriesList = res;
      console.log(res)
    })
  }

  async onSubmitNewProduct(productForm: NgForm) {
    console.log(productForm.value)
    if (productForm.invalid) { return; }
    else {
      this._loader.loaderOn();
      this._products.createProduct(this.newProduct, this.selectedFile).then(() => {
        this.addProductModal?.hide();
        productForm.resetForm();
        console.log('en el then')
      }).finally(()=> {
        console.log('terminó de subir?')
        this.selectedFile = undefined;
        this._loader.loaderOff();
      });
    }
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // async getProducts(): Promise<void> {
  //   this._loader.loaderOn();
  //   this.productsList = [];
  //   this._products.readProducts().then((res: any) => {
  //     //console.log(res);
  //     this.productsList = res;
  //     this._loader.loaderOff();
  //   })
  // }

  getProducts() {
    this._loader.loaderOn();
    this._products.getProductsObs().subscribe(products => {
      console.log('subs', products);
      this.productsList = products;
      this._loader.loaderOff();
    })
  }

  showEditProductModal(product: Product, product_id : string)  {
    console.log(product)
    this.activateEditSubcategorySelect(product.product_category).then(()=> {
      this.editProductModal?.show();
    });
    this.product = product;
    this.productId = product_id;
  }

  async onSubmitEditProduct(editProductForm: NgForm) {
    console.log('edit')
    if (editProductForm.invalid) { return; }
    else {
      console.log(this.selectedFile);
      this._products.updateProduct(this.productId, this.product, this.selectedFile).then(()=> {
        this.editProductModal?.hide();
        this.selectedFile = undefined;
        let fileInput = document.getElementById('ntEditProductImage') as any;
        fileInput.value = '';
      });
      //this.getProducts();
      //this.resetProductForm(editProductForm);
    }
  }

  showDeleteProductModal(product: Product, product_id: string)  {
    this.productName = product.product_name;
    this.productId = product_id;
    this.productImageName = product.product_imageName;
    this.deleteProductModal?.show();
  }

  deleteProduct(id: string, imagename: string) {
    this._loader.loaderOn();
    this._products.deleteProduct(id, imagename).then(() => {
      this.deleteProductModal?.hide();
      this.updateProductsList(id);
      this._loader.loaderOff();
    });
  }

  updateProductsList(id: string){
    //this is for update the list when a product is deleted
    this.productsList = this.productsList.filter((product: any) => product.id !== id);
  }

  activateSubcategorySelect(value: string) {
    console.log(value)
    const categoriaSeleccionada = this.categoriesList.find(categoria => categoria.category_id === value);

    if (categoriaSeleccionada) {
      // Filtrar las subcategorías de la categoría seleccionada
      this.subcategoriesList = categoriaSeleccionada.subcategories.filter((subcategoria:any) => subcategoria.subcategory_status === 'active');
    }
    console.log(this.subcategoriesList);
    
    const selectSubcategorias = document.getElementById('ntProductSubcategory') as HTMLSelectElement;
    selectSubcategorias.disabled = true;

    if (this.subcategoriesList.length > 0) {
      selectSubcategorias.disabled = false;
    }
  }

  async activateEditSubcategorySelect(value: string) {
    console.log(value)
    const categoriaSeleccionada = this.categoriesList.find(categoria => categoria.category_id === value);

    if (categoriaSeleccionada) {
      // Filtrar las subcategorías de la categoría seleccionada
      this.subcategoriesList = categoriaSeleccionada.subcategories.filter((subcategoria:any) => subcategoria.subcategory_status === 'active');
    }
    console.log(this.subcategoriesList);
    
    const selectSubcategorias = document.getElementById('ntEditProductSubcategory') as HTMLSelectElement;
    selectSubcategorias.disabled = true;

    if (this.subcategoriesList.length > 0) {
      this.product.product_subcategory = '';
      selectSubcategorias.disabled = false;
    }
  }

  resetForm(someForm: NgForm) {
    someForm.resetForm();
  }

  // cleanSelectedFile(form: NgForm) {
  //   form.control['product_image'] = null;
  // }
}
