import { Injectable } from "@angular/core";

import { Observable } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { map } from "rxjs/operators";

export type Datas = {
  foo: boolean;
};

@Injectable()
export class DataService {
  constructor() {}

  getDatas(): Observable<Datas> {
    return of({ foo: false }).pipe(map(val => ({ foo: true })));
  }
}
