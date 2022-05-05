import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { DataService, AlertService, AccountService } from '@app/_services';
import { SpecificationService } from '@app/_services/specification.service';
import { RealtimeService } from '@app/_services/realtime.service';


import { TaskData } from '@app/_models';

@Component({ templateUrl: 'dashboard.component.html' })
export class DashboardComponent implements OnInit, OnChanges {
    loading = false;
    RealTimeData: {};
    interval: any;

    constructor(
        private specificationService: SpecificationService,
        private realtimeSerivce: RealtimeService,
        private http: HttpClient,
        private alertService: AlertService,
        private accountservice: AccountService,
        ) {
    }

    ngOnInit(): void {
        if (this.accountservice.userValue) {
            this.loadRTData();
        }
    }

    ngOnChanges(changes: SimpleChanges): void {

    }

    public loadRTData() {
        this.realtimeSerivce.getRT("", "", "30.0")
        .subscribe({
            next: (rt) => {this.RealTimeData = rt.reduce(
                function (obj , item) {

                    var key: string = item.TaskID;

                    if (!obj.hasOwnProperty(key)) {

                        let task = new TaskData();
                        obj[key] = [];

                        task.TaskID = item.TaskID;
                        task.WelderID = item.WelderID;
                        task.RunNo = item.RunNo;
                        task.MachineID = item.MachineID;

                        obj[key].push(task)
                    }

                    obj[key].push(item); //tsconfig.json -> "noImplicitAny": false -> override the error for implicit any
                    return obj;

                }, {})
            
            },
        error: error => {
            this.alertService.error(error);
            clearInterval(this.interval);
            }
        });
    }
}