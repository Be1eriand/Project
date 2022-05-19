import { Component, OnInit, Input } from '@angular/core';
import { Specification } from '@app/_models';
import { RealTimeView } from '@app/_models';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.sass']
})
export class DataComponent implements OnInit {

  @Input() specification: Specification;
  @Input() realtime: RealTimeView;

  @Input() task: [][];

  chartOptions: EChartsOption = {};
  gradientOptions: EChartsOption = {};

  
  constructor() { }

  ngOnInit(): void {

    console.log("data input", this.task);

    // Need to get min and max to create axis range

    // Need WPS data for lines.

    const time = this.task[0]['data'].map(function (item) {
      return new Date(item['Time']).toLocaleString();
    });
    const voltage = this.task[0]['data'].map(function (item) {
      return item['Voltage'];
    });

    this.chartOptions = {
      toolbox: {
        show: true,
        feature: {
          dataZoom: {
            yAxisIndex: "none"
          },
          dataView: {
            readOnly: false
          },
          magicType: {
            type: ["line", "bar"]
          },
          restore: {},
          saveAsImage: {
            type: "png"
          }
        }
      },
      title: {
        left: 'center',
        text: 'Voltage'
      },

        tooltip: {
          trigger: 'axis'
        },
      xAxis: {
        name: 'Date Time',
        data: time,
      },
      yAxis: {
        name: 'Voltage',
        min: 14,
        max: 35,
        type: 'value',
      },
      series: [
        {
          data: voltage,
          type: 'line',
          markLine: {
            lineStyle: {
              type: 'solid',
              color: '#5470c6'
            },
            data: [
              {
                yAxis: this.task[1]['Voltage_Max'],
                name: 'Voltage Max'
              },
              {
                yAxis: this.task[1]['Voltage_Min'],
                name: 'Voltage Min',
                
              },
            ]
            },
        },
      ],
      visualMap: {
        top: 50,
        right: 10,
        pieces: [
          {
            gt: this.task[1]['Voltage_Min'],
            lte: this.task[1]['Voltage_Max'],
            color: '#93CE07',
          },
        ],
        outOfRange: {
          color: '#FD0100'
        }
      },
    };

  }
}