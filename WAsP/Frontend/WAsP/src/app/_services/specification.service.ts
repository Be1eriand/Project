import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ContractTaskView, Specification } from '@app/_models';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {

  constructor(
    private router: Router,
        private http: HttpClient
  ) { }

  getAllSpecs(): Observable<Specification[]> {
    return this.http.get<Specification[]>(`${environment.apiUrl}/data/specification`);
  }

  getSpec(spec: string): Observable<Specification[]> {
    return this.http.get<Specification[]>(`${environment.apiUrl}/data/specification/${spec}`);
  }

  getSpecRun(spec: string, run: string): Observable<Specification> {
    return this.http.get<Specification>(`${environment.apiUrl}/data/specification/${spec}/${run}`);
  }

  updateSpec(spec: string, params: any): Observable<Specification>{
    return this.http.put<Specification>(`${environment.apiUrl}/data/specification/${spec}`, params)
  }

  updateSpecRun(spec: string, run: string, params: any): Observable<Specification>{
    return this.http.put<Specification>(`${environment.apiUrl}/data/specification/${spec}/${run}`, params)
  }

}
  getAllContracts(): Observable<ContractTaskView[]> {
    return this.http.get<ContractTaskView[]>(`${environment.apiUrl}/data/contracts`);
  }

  getContract(contract: string): Observable<ContractTaskView> {
    return this.http.get<ContractTaskView>(`${environment.apiUrl}/data/contracts/${contract}`);
  }

}
