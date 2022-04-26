import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService, AlertService } from '@app/_services';
import { SpecificationService } from '@app/_services/specification.service';
import { RealtimeService } from '@app/_services/realtime.service';


import { RealTimeView } from '@app/_models';

@Component({ templateUrl: 'dashboard.component.html' })
export class DashboardComponent {
    loading = false;
    allRT: RealTimeView[];

    constructor(
        private specificationService: SpecificationService,
        private realtimeSerivce: RealtimeService,
        private http: HttpClient,
        private alertService: AlertService
        ) {
    }

    public load() {
        this.realtimeSerivce.getAllRT()
        .subscribe({
            next: (rt) => {this.allRT = rt},
        error: error => {
            this.alertService.error(error);
            this.loading = false;
            }
        });

        console.log(this.allRT);
    }
}