import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  loaderCont = document.getElementById('loaderContainer');
  constructor() { }

  loaderOn() {
    this.loaderCont?.classList.remove('d-none');
  }

  loaderOff() {
    setTimeout(() => {
      this.loaderCont?.classList.add('d-none');
    }, 100);
  }
}
