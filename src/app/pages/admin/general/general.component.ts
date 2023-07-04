import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from 'src/app/services/analytics.service';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  userCount: number = 0;
  userCountIsDone:boolean = false;
  productsCount: number = 0;
  productsCountIsDone: boolean = false;
  discountCodesCount: number = 0;
  discountCodesCountIsDone: boolean = false;
  newOrdersCount: number = 0;
  newOrdersCountIsDone: boolean = false;
  constructor(private _analytics: AnalyticsService) {

  }

  ngOnInit(): void {
      this.callUserCount();
      this.callProductsCount();
      this.callDiscountCodes();
      this.callNewOrders();
  }

  callUserCount() {
    this._analytics.obtainUserCount().subscribe((count: number) => {
      //console.log('Número de usuarios:', count);
      this.userCount = count;
      this.userCountIsDone = true;
    });
  }

  callProductsCount() {
    this._analytics.obtainProductsCount().subscribe((count: number) => {
      //console.log('Número de productos:', count);
      this.productsCount = count;
      this.productsCountIsDone = true;
    });
  }

  callNewOrders() {
    this._analytics.obtainNewOrders().subscribe((count: number) => {
      //console.log('Número de pedidos:', count);
      this.newOrdersCount = count;
      this.newOrdersCountIsDone = true;
    });
  }

  
  callDiscountCodes() {
    this._analytics.obtainDiscountCodes().subscribe((count: number) => {
      //console.log('Número de cupones:', count);
      this.discountCodesCount = count;
      this.discountCodesCountIsDone = true;
    });
  }
}
