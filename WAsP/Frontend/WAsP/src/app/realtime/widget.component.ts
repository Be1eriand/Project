import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartsOption, EChartsType } from 'echarts';

import { RealTimeView, RealTimeData, TaskData, Specification } from '@app/_models';
import { AlertService, AccountService, DataService, RealtimeService } from '@app/_services';

@Component({ 
    selector: 'realtime-card',
    templateUrl: 'widget.component.html',
    styleUrls: ['widget.component.sass'],    
})

export class WidgetComponent implements OnInit, OnChanges {
    @Input() dataView: RealTimeView[];
    Task: TaskData = new TaskData();
    data: RealTimeData[];
    spec: Specification;
    interval: any;

    displayList = ['Current', 'Voltage'];

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
        private http: HttpClient,
        private accountservice: AccountService,
        private alertService: AlertService,
        private dataService: DataService,
        private realTimeService: RealtimeService,
        ) {
    }

    ngOnInit(): void {
    }

    onChartInit(ec) {
        this.echartsInstance = ec;
    }

    ngOnChanges(changes: SimpleChanges) {

        this.Task = this.dataView.shift();

        this.data = this.dataView.reduce( function(obj , element) {

            delete element.TaskID;
            delete element.WelderID;
            delete element.RunNo;
            delete element.MachineID;

            var rtd = new RealTimeData();

            for (let key in element) {
                rtd[key] = element[key];
            }

            obj.push(rtd);

            return obj;
        }, []);

        this.loadSpecData(this.Task.TaskID, this.Task.RunNo);

        if (this.accountservice.userValue) {
            this.loadRTData(this.Task.TaskID, this.Task.RunNo);
            this.interval = setInterval(() => {
                if (this.accountservice.userValue) {
                    this.updateChart();
                } else {
                    clearInterval(this.interval);
                }
            }, 1000);
        };
    }
    
    private loadSpecData(task: string, run: string){

        this.dataService.getTaskRun(task, run).subscribe({
            next: (spec) => { 
                this.spec = spec[0];
            }
        });
        
    }

    private loadRTData(Task: string, Run: string) {
        this.realTimeService.getRT(Task, Run, '30.0').subscribe({
            next: (rt) => { 
                if (rt.length == 0) clearInterval(this.interval);
                
                this.data = rt.reduce( function(obj , element) {

                    delete element.TaskID;
                    delete element.WelderID;
                    delete element.RunNo;
                    delete element.MachineID;
        
                    var rtd = new RealTimeData();
        
                    for (let key in element) {
                        rtd[key] = element[key];
                    }
        
                    obj.push(rtd);
        
                    return obj;
                }, []);
            }
        });
    }

    private updateChart() {

        this.loadRTData(this.Task.TaskID, this.Task.RunNo);

        let time = getTimeStream(this.data);

        let min = time.reduce(function (a, b) { return a < b ? a : b; });
        let max = time.reduce(function (a, b) { return a > b ? a : b; });

        let dataList = [];
        let yAxisIndex = 0;

        this.displayList.forEach((d) => {dataList.push({
            type: 'line',
            data: getDataPair(this.data, d, 'Time'),
            showSymbol: false ,
            animation: false ,
            yAxisIndex: yAxisIndex++,
            })
        });

        for (const [_, value] of Object.entries(getLimits(this.spec, time, 'Current'))) {
            dataList.push({
            type: 'line',
            data: value,
            showSymbol: false ,
            animation: false ,
            yAxisIndex: 0,
            })
        }

        for (const [_, value] of Object.entries(getLimits(this.spec, time, 'Voltage'))) {
            dataList.push({
            type: 'line',
            data: value,
            showSymbol: false ,
            animation: false ,
            yAxisIndex: 1,
            })
        }

        this.chartOption = updateChartOptions(this.chartOption, dataList, min, max, time);
        this.echartsInstance.setOption(this.chartOption);
    }
      
}

function getTimeStream(data: RealTimeData[]) {

    return data.map((d) => { return d['Time'] ;} );
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