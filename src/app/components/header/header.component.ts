import { Component, HostListener } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

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

  public getScreenWidth: any;

  constructor(private _router: Router) {

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

}
