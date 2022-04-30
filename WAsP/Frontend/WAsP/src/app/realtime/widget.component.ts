import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EChartsOption } from 'echarts';

import { RealTimeView, RealTimeData, TaskData } from '@app/_models';

@Component({ 
    selector: 'realtime-card',
    templateUrl: 'widget.component.html',
    styleUrls: ['widget.component.sass'],    
})

export class WidgetComponent implements OnInit, OnChanges {
    @Input() dataView: RealTimeView[];
    Task: TaskData = new TaskData();
    data: RealTimeData[];

    displayList = ['Current', 'Voltage'];

    chartOption: EChartsOption = {};

    constructor(
        private http: HttpClient) {
    }

    ngOnInit(): void {

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

        this.chartOption = {
            xAxis: {
                id: 0,
                type: 'time',
                min: min,
                max: max,
                data: time,                
                axisLabel: {
                    rotate: 90 ,
                },
              },
              yAxis: [{
                id: 0,
                type: 'value',
                scale: true ,
              },
              {
                id: 1,
                type: 'value',
                scale: true ,
              },
            ],
              series: dataList,
          };
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
        
    }
      
}

function getTimeStream(data: RealTimeData[]) {

    return data.map((d) => { return d['Time'] ;} );
}

function getDataPair(data: RealTimeData[], x: string, y: string) {

    return data.map((d) => { return [ d[y], parseFloat(d[x])]});
}