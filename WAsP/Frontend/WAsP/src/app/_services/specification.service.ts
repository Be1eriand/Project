import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {  Observable, BehaviorSubject } from 'rxjs';
import { ContractTaskView, Specification } from '@app/_models';

import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {

  private specSubjects: BehaviorSubject<Specification[]>;
  public specifications: Observable<Specification[]>;

  constructor(
    private http: HttpClient
  ) { 
    this.specSubjects = new BehaviorSubject<Specification[]>([]);
    this.specifications = this.specSubjects.asObservable();
  }

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

  getAllContracts(): Observable<ContractTaskView[]> {
    return this.http.get<ContractTaskView[]>(`${environment.apiUrl}/data/contracts`);
  }

  getContract(contract: string): Observable<ContractTaskView> {
    return this.http.get<ContractTaskView>(`${environment.apiUrl}/data/contracts/${contract}`);
  }

}
