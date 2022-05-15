import { Component, OnInit, OnDestroy } from '@angular/core';

import { AlertService, AccountService,  SocketService } from '@app/_services';
import { lineColour, specDetails } from './realtime.module';

@Component({ templateUrl: 'dashboard.component.html',
             styleUrls: ['dashboard.component.sass'], 
 })
export class DashboardComponent implements OnInit, OnDestroy  {

    selected: string[] = [];
    numSelect = 0;
    specList: specDetails[] = [
        {"name": 'Voltage',
         "units": 'Volts'},
        {"name": 'Current',
         "units": 'Amps'},
        {"name": 'Heat Input',
         "units": 'KJ/mm'},
        {"name": 'Travel Speed',
         "units": 'mm/min'},
    ]

    ActiveTasks: any[];
    lines: lineColour[] = [
        {"colour": "#0e09f8",
        "line": "Voltage"},
        {"colour": "#f80909",
        "line": "Voltage Max"},
        {"colour": "#7101d2",
        "line": "Voltage Min"},
        {"colour": "#00fd22",
        "line": "Current"},
        {"colour": "#ff7600",
        "line": "Current Max"},
        {"colour": "#edfd00",
        "line": "Current Min"},
    ]

    constructor(
        private socketService: SocketService,
        private alertService: AlertService,
        private accountservice: AccountService,
        ) {
            this.selected.push(this.specList[0].name);
            this.selected.push(this.specList[1].name);
            this.numSelect = this.selected.length;
        }

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
