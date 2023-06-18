import { Component, HostListener } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { AuthService } from 'src/app/services/auth.service';
import { CategoriesService } from 'src/app/services/categories.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  //for navbar toggler
  isCollapsed: boolean = true;
  navTeaIsCollapsed: boolean = true;
  accIsCollapsed: boolean = true;
  giftIsCollapsed: boolean = true;
  cateList: Category[] = [];

  public getScreenWidth: any;

  constructor(private _router: Router, 
    private _categories: CategoriesService,
    private _auth: AuthService) {
    this.getScreenWidth = window.innerWidth;
    this.getAllCategoriesObs();
  }

  ngOnInit() {
    this.onWindowResize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;

    if (this.getScreenWidth > 992) {
      this.isCollapsed = false;
    }
    else {
      this.isCollapsed = true;
    }
  }

  navegarCategoria(name: string, id: string) {
    const queryParams = { name, id };
    this._router.navigate(['/categoria'], { queryParams });
  }

  getAllCategoriesObs() {
    this._categories.readAllSubcategories().subscribe((allCats: Category[]) => {
      this.cateList = allCats
    })
  }

  dropdownStates: { [key: string]: boolean } = {};

  toggleDropdown(dropdownId: string): void {
    this.dropdownStates[dropdownId] = !this.dropdownStates[dropdownId];
  }

  prueba() {
    const isAuthenticated = this._auth.isAuthenticated();
    if (isAuthenticated) {
      this._router.navigate(['/cliente']);
    } else {
      this._auth.logout();
      this._router.navigate(['ingresa'])
    }
  }
}
