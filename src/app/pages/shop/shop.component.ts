import { Component, HostListener, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category.model';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  cateList: Category[] = [];
  offCanvasShopIsCollapsed: boolean = false;
  getScreenWidth: any;
  
  constructor(private _categories: CategoriesService,) {
  }

  ngOnInit(): void {
    this.getCategoriesListFromSv();
  }

  getAllCategoriesObs() {
    this._categories.readAllOrderedSubcategories().subscribe((allCats: Category[]) => {
      this.cateList = allCats
    })
  }

  getCategoriesListFromSv() {
    this.cateList = this._categories.getCategoriesList();
    if (this.cateList.length === 0) {
      this.getAllCategoriesObs();
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > 992) {
      this.offCanvasShopIsCollapsed = false;
    }
    else {
      this.offCanvasShopIsCollapsed = true;
    }
  }
}
