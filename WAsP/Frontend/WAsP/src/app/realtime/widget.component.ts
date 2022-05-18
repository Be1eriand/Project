import { Component, OnInit, Input, OnDestroy, Output, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption, EChartsType } from 'echarts';

import { RealTimeData, TaskData, Specification, RealTimeView, RTAlert } from '@app/_models';
import { AlertService, DataService, SocketService } from '@app/_services';
import { lineColour, specDetails } from './realtime.module';
import { Subscription } from 'rxjs';

@Component({ 
    selector: 'realtime-card',
    templateUrl: 'widget.component.html',
    styleUrls: ['widget.component.sass'],    
})

export class WidgetComponent implements OnInit, OnDestroy, OnChanges {

    @Input() Machine: string;
    @Input() LineColours: lineColour[];
    @Input() List: string[];
    @Output() nAlerts: number;

    displayList = ['Current', 'Voltage'];

    Data: RealTimeData[] = [];
    Spec: Specification;
    Task: TaskData;
    Alerts: RTAlert[] = [];

    numAlerts = 0;

    AlertSubscription: Subscription;
    RealTimeSubscription: Subscription;

    echartsInstance: EChartsType;
    chartOption: EChartsOption = {
        xAxis: {
            id: 0,
            type: 'time',               
            axisLabel: {
                rotate: 90 ,
            },
            minInterval: 5,
          },
          yAxis: [{
            id: 0,
            type: 'value',
            scale: true ,
            alignTicks: true ,
          },
          {
            id: 1,
            type: 'value',
            scale: true ,
            alignTicks: true ,
          },
        ],
      };

    constructor(
        private dataService: DataService,
        private socketService: SocketService,
        private alertService: AlertService,
        ) {
    }

    ngOnInit(): void {

        if ((this.List === undefined) || (this.List.length == 0))
            this.List = this.displayList;

        this.List = this.List.reduce((arr, l) => {
            if (l !== undefined){
                let v = l.replace(' ', '');
                if (v !== '') 
                    arr.push(v);
            }
            return arr;
        }, [])
            
        this.RealTimeSubscription = this.socketService.getRTstream(this.Machine).subscribe({
            next: data => {
                if (this.Task === undefined){
                    this.Task = this.getTaskData(data);
                }
                let rtData = this.getRTdata(data);
                this.Data.push(rtData);
                if (this.Data.length > 30) this.Data.shift()

                this.updateChart();
            },
            error: error => {
                    this.alertService.error(error);
            }
        });

        this.AlertSubscription = this.socketService.getRealTimeAlert(this.Machine).subscribe({
            next: (alert) => {
                this.Alerts.push(alert)
                this.numAlerts = this.Alerts.length;
                console.log(this.numAlerts);
                console.log(this.Alerts);
            }
        });

    }

    ngOnDestroy(): void {
        this.AlertSubscription.unsubscribe();
        this.RealTimeSubscription.unsubscribe();
    }

    onChartInit(ec) {
        this.echartsInstance = ec;
    }

    ngOnChanges(changes: SimpleChanges): void {
        
        for( const propName in changes) {
            console.log(propName);
        }
    }

    private updateChart() {

        if (this.Spec === undefined) {
            this.dataService.getTaskRun(this.Task["TaskID"], this.Task["RunNo"]).subscribe({
                next: spec => {
                    this.Spec = spec;
                },
                error: error => {
                        this.alertService.error(error);
                }
            });
        }

        if ((this.Data === undefined) || (this.Data.length == 0)) {
            return;
        }

        let time = getTimeStream(this.Data);

        let min = time.reduce(function (a, b) { return a < b ? a : b; });
        let max = time.reduce(function (a, b) { return a > b ? a : b; });

        let dataList = [];
        let yAxisIndex = 0;

        if (this.Spec === undefined) {
            return;
        }

        this.List.forEach((d) => {
            dataList.push({
            type: 'line',
            color: this.LineColours[yAxisIndex*3].colour,
            data: getDataPair(this.Data, d, 'Time'),
            showSymbol: false ,
            animation: false ,
            yAxisIndex: yAxisIndex,
            })

            let i = 1;
            for (const [_, value] of Object.entries(getLimits(this.Spec[0], time, d))) { dataList.push({
                type: 'line',
                color: this.LineColours[yAxisIndex*3 + i].colour,
                data: value,
                showSymbol: false ,
                animation: false ,
                yAxisIndex: yAxisIndex,
                })
                i++;
            }
            yAxisIndex++;
        });

        this.chartOption = updateChartOptions(this.chartOption, dataList, min, max, time);
        this.echartsInstance.setOption(this.chartOption);
    }

    getTaskData(data: RealTimeView[]): TaskData {

        let task = new TaskData;
        
        task["TaskID"] = data["TaskID"];
        task["MachineID"] = data["MachineID"];
        task["RunNo"] = data["RunNo"];
        task["WelderID"] = data["WelderID"];

        return task;
    }
    
    getRTdata(data: RealTimeView[]): RealTimeData {
    
        let rtd = new RealTimeData();

        rtd.Current = data["Current"];
        rtd.GasUsed = data["GasUsed"];
        rtd.HeatInput = data["HeatInput"];
        rtd.Length = data["Length"];
        rtd.Power = data["Power"];
        rtd.Temperature = data["Temperature"];
        rtd.Time = data["Time"];
        rtd.Timedelta = data["Timedelta"];
        rtd.TravelSpeed = data["TravelSpeed"];
        rtd.Voltage = data["Voltage"];
        rtd.WireFeedrate = data["WireFeedrate"]; 

        return rtd;
    }
      
}

function getTimeStream(data: RealTimeData[]) {

    return data.map((d) => { return d["Time"]; } );
}

function getDataPair(data: RealTimeData[], x: string, y: string) {

    return data.map((d) => { return [ d[y], parseFloat(d[x])]});
}

function updateChartOptions(chartOption: EChartsOption, list: any[], min: string, max: string, time: any[]): EChartsOption {

    chartOption.series = list;
    chartOption.xAxis['min'] = min;
    chartOption.xAxis['max'] = max;
    chartOption.xAxis['data'] = time;

    return chartOption;
}

function getLimits(spec: Specification, time: any[], limit: string) {

    let max = spec[limit + '_Max'];
    let min = spec[limit + '_Min'];

    let data = {};

    data['max'] = time.map((t) => {
        return [t, parseFloat(max)];
    });

    data['min'] = time.map((t) => {
        return [t, parseFloat(min)];
    });

    return data;
}

