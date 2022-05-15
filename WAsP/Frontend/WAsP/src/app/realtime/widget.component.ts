import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { EChartsOption, EChartsType } from 'echarts';

import { RealTimeData, TaskData, Specification } from '@app/_models';
import { DataService, SocketService } from '@app/_services';
import { lineColour, specDetails } from './realtime.module';
import { Subscription } from 'rxjs';

@Component({ 
    selector: 'realtime-card',
    templateUrl: 'widget.component.html',
    styleUrls: ['widget.component.sass'],    
})

export class WidgetComponent implements OnInit, OnDestroy {
    @Input() Data: RealTimeData[];
    @Input() Spec: Specification;
    @Input() Task: TaskData;
    @Input() LineColours: lineColour[];
    @Input() List: string[];

    displayList = ['Current', 'Voltage'];

    AlertSubscription: Subscription;

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
            
        this.updateChart();
        this.AlertSubscription = this.socketService.getRealTimeAlert(this.Task.TaskID, this.Task.RunNo).subscribe({
            next: (alert) => {
                console.log(alert);
            }
        });
    }

    ngOnDestroy(): void {
        this.AlertSubscription.unsubscribe();
    }

    onChartInit(ec) {
        this.echartsInstance = ec;
    }

    private updateChart() {

        let time = getTimeStream(this.Data);

        let min = time.reduce(function (a, b) { return a < b ? a : b; });
        let max = time.reduce(function (a, b) { return a > b ? a : b; });

        let dataList = [];
        let yAxisIndex = 0;

        this.List.forEach((d) => {dataList.push({
            type: 'line',
            color: this.LineColours[yAxisIndex*3].colour,
            data: getDataPair(this.Data, d, 'Time'),
            showSymbol: false ,
            animation: false ,
            yAxisIndex: yAxisIndex,
            })

            let i = 1;
            for (const [_, value] of Object.entries(getLimits(this.Spec[0], time, d))) {
                dataList.push({
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