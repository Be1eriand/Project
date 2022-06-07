import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Machine, Welder, Spec, Specification} from '@app/_models';

@Injectable({ providedIn: 'root' })
//Todo Expand the Data Service class
export class DataService{

    constructor(
        private http: HttpClient
    ) {
    }

    getMachines(): Observable<Machine[]> {
        return this.http.get<Machine[]>(`${environment.apiUrl}/data/machine`);
    }

    getWelders(): Observable<Welder[]> {
        return this.http.get<Welder[]>(`${environment.apiUrl}/data/welder`);
    }

    getSpecList(): Observable<Spec[]> {
        return this.http.get<Spec[]>(`${environment.apiUrl}/data/specification/list`);
    }

    getTask(task: string): Observable<Specification[]> {
        return this.http.get<Specification[]>(`${environment.apiUrl}/data/specificationview/${task}`)
      }
    
    getTaskRun(task: string, run: string): Observable<Specification> {
        return this.http.get<Specification>(`${environment.apiUrl}/data/specificationview/${task}/${run}`)
      }
}