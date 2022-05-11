import { Component, OnInit, OnDestroy } from '@angular/core';

import { AlertService, AccountService,  SocketService } from '@app/_services';

@Component({ templateUrl: 'dashboard.component.html' })
export class DashboardComponent implements OnInit, OnDestroy  {

    ActiveTasks: any[];

    constructor(
        private socketService: SocketService,
        private alertService: AlertService,
        private accountservice: AccountService,
        ) {}

    ngOnInit(): void {
        if (this.accountservice.userValue) {

            this.socketService.getActiveMachines2().subscribe({
                next: (td) => {
                    let arr = []

                    td['active'].forEach(function (item) {
                        let t = item.TaskID;
                        let mappped = {};
                        mappped['Task'] = item;
                        mappped['Spec'] = td[t]['WPS'];
                        mappped['Data'] = td[t]['RT'];
                        arr.push(mappped);
                    })
                    this.ActiveTasks = arr;

                },
                error: error => {
                    this.alertService.error(error);
                }
            })
        }
    }

    ngOnDestroy(): void {
        this.socketService.tdSocketListener.unsubscribe();
    }
}