import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService, AccountService,  SocketService, DataService } from '@app/_services';
import { lineColour, specDetails, ActiveMachine } from './realtime.module';
import { RTAlert, Machine } from '@app/_models'

@Component({ templateUrl: 'dashboard.component.html',
             styleUrls: ['dashboard.component.sass'], 
 })
export class DashboardComponent implements OnInit, OnDestroy, OnChanges  {

    machineList: ActiveMachine[] = [];
    selected: string[] = [];
    selection: string[] = [];
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

    Alerts: RTAlert[] = [];

    AlertSubscription: Subscription;
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
        private alertService: AlertService,
        private dataService: DataService,
        ) {
            this.selected.push(this.specList[0].name);
            this.selected.push(this.specList[1].name);
            this.numSelect = this.selected.length;

            this.dataService.getMachines().subscribe({
                next: (m) => {
                    this.machineList = m.reduce((arr, machine)=> {
                        let newMachine: ActiveMachine = new ActiveMachine();
                        newMachine.MachineID = machine.id;
                        newMachine.active = false;
                        newMachine.nAlerts = 0;

                        arr.push(newMachine);
                        arr.sort(machineSort);

                        return arr;
                    }, []);
                },
                error: error => {
                    this.alertService.error(error);
                }
            })
        }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    updateAlerts(machineUpdate) {

        let activeMachine = this.machineList.find(m => m.MachineID === machineUpdate.MachineID);
        activeMachine.nAlerts = machineUpdate.nAlerts;
        this.machineList.sort(machineSort)

    }

    updateSelected(selected) {

        this.selection = this.selected;
 
        for (const select in this.selected){
            if (this.selection[select] !== undefined){
                this.lines[parseInt(select)*3].line = this.selection[select];
                this.lines[parseInt(select)*3 + 1].line = this.selection[select] + ' Max';
                this.lines[parseInt(select)*3 + 2].line = this.selection[select] + ' Min';
            }
        }
    }

    getUnits(index) {
        let variable = this.selection[index];
        console.log(this.specList);
        console.log(this.specList.find(v => v.name = variable).units);
        return 'Volts'
    }
}

function machineSort(a: ActiveMachine, b: ActiveMachine) { //we'll deal with the alerts in a second.
    if (a.nAlerts < b.nAlerts) return 1;
    if (a.nAlerts > b.nAlerts) return -1;
    return 0;
}
