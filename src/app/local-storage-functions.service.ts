import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageFunctionsService {

  constructor() { }

  async waitForItemInLocalStorage(key: string): Promise<string> {
    return new Promise((resolve) => {
      const checkLocalStorage = () => {
        const item = localStorage.getItem(key);
        if (item) {
          resolve(item);
        } else {
          setTimeout(checkLocalStorage, 100); // Revisar nuevamente en 100 milisegundos
        }
      };
      checkLocalStorage();
    });
  }
}
