import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Task, ContractTaskView } from '@app/_models';

@Injectable({ providedIn: 'root' })

export class DataService{

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
    }

    post() {

        return this.http.post<ContractTaskView>(`${environment.apiUrl}/data/contracts/`, { ContractID: 101, ContractName: 'Contract 11', Details: 'Its a contract', WPS_No: 3, Welderid: 709160, Machineid: 1 })
            .pipe();
    }
}