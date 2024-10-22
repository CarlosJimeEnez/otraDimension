import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataTransferService {
  private dataSubjet = new BehaviorSubject<any>(null);
  public data$ = this.dataSubjet.asObservable();

  setData(newData: any) {
    this.dataSubjet.next(newData);
    console.log('send data ' + newData);
  }

  getCurrentValue() {
    console.log('get DATA: ' + this.dataSubjet.value);
    return this.dataSubjet.value;
  }

  constructor() {}
}
