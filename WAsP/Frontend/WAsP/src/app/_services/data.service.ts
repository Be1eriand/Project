import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { RealTimeView,TaskData, ContractTaskView } from '@app/_models';

@Injectable({ providedIn: 'root' })
//Todo Expand the Data Service class
export class DataService{

    constructor(
        private http: HttpClient
    ) {
    }

    post(params: any) {

        return this.http.post<ContractTaskView>(`${environment.apiUrl}/data/contracts/`, params)
            .pipe();
    }
}

export class RealTimeDataService{
    public task: Observable<TaskData>;
    public data: Observable<RealTimeView>;

    constructor(
        private http: HttpClient,
    ) {
    }

    retrieve() {
        return this.http.get<RealTimeView>(`${environment.apiUrl}/data/realtime/`)
    }
}