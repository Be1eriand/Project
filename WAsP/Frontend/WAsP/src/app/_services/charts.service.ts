import { Injectable } from '@angular/core';
import { EChartsOption } from 'echarts';

@Injectable({
  providedIn: 'root'
})
export class ChartsService {

  lineChart: EChartsOption = {};
  gaugeChart: EChartsOption = {};
  pieChart: EChartsOption = {};
  boxplot: EChartsOption = {};
  radarChart:EChartsOption = {};
  barChart: EChartsOption = {};

  constructor() { }

  // Line chart - showing Min and Max. In Range displays as green
  // task[0] = all realtime, task[1] = wps, task[2] = summarised realtime
  lineChartMinMaxOptions(title, variable, task) {

    const data = task[0]['data'].map((item) => {
      return item[variable].toFixed(1);
    });
    const time = task[0]['data'].map(function (item) {
      return new Date(item['Time']).toLocaleString();
    });

    this.lineChart = {
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
        text: 'Realtime Weld Data',
        subtext: variable + ' - Task '+ task[0]['TaskID'] + ' Run ' + task[0]['RunNo'],
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        right: '15%',
        bottom: '30%',
      },
      xAxis: {
        name: 'Date Time',
        nameLocation: 'middle',
        nameGap: 35,
        boundaryGap: true,
        data: time,
      },
      yAxis: {
        name: title,
        nameLocation: 'middle',
        nameGap: 50,
        boundaryGap: ['50%', '100%'],
        type: 'value',
        min: (task[2][variable + '_Min'] / 3).toFixed(0)
      },
      series: [
        {
          data: task[0]['data'].map((item) => {
            return item[variable].toFixed(1);
          }),
          type: 'line',
          markLine: {
            lineStyle: {
              type: 'solid',
            },
            data: [
              {
                yAxis: task[1][variable + '_Max']
              },
              {
                yAxis: task[1][variable + '_Min']

              },
            ]
          },
        },
      ],
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100
        }
      ],
      visualMap: {
        top: 50,
        right: 10,
        pieces: [
          {
            gt: task[1][variable + '_Min'],
            lte: task[1][variable + '_Max'],
            color: '#93CE07',
            label: 'Within Range ' + task[1][variable + '_Min'] + '-' + task[1][variable + '_Max']
          },
        ],
        outOfRange: {
          color: '#ff6028'
        }
      },
    };
    return this.lineChart;
  };

  // Line Chart - when Min and Max are equal values
  lineChartOptions(title, variable, task) {

    const data = task[0]['data'].map((item) => {
      return item[variable].toFixed(1);
    });
    const time = task[0]['data'].map(function (item) {
      return new Date(item['Time']).toLocaleString();
    });

    this.lineChart = {
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
        text: 'Realtime Weld Data',
        subtext: variable + ' - Task '+ task[0]['TaskID'] + ' Run ' + task[0]['RunNo'],
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        right: '15%',
        bottom: '30%',
      },
      xAxis: {
        name: 'Date Time',
        nameLocation: 'middle',
        nameGap: 35,
        boundaryGap: true,
        data: time,
      },
      yAxis: {
        name: title,
        nameLocation: 'middle',
        nameGap: 50,
        boundaryGap: ['50%', '100%'],
        type: 'value',
        min: (task[2][variable + '_Min'] / 3).toFixed(0)
      },
      series: [
        {
          data: task[0]['data'].map((item) => {
            return item[variable].toFixed(1);
          }),
          type: 'line',
          markLine: {
            lineStyle: {
              type: 'solid',
              color: '#5470c6'
            },
            data: [
              {
                yAxis: task[1][variable + '_Max'],
                name: 'Min and Max: ' + task[1][variable + '_Max'],
                label: { formatter: '{b}' }
              }
            ]
          },
        },
      ],
      visualMap: [
        {
          show: false,
          type: 'continuous',
          min: 0,
          max: task[2][variable + '_Max']
        },
      ],
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100
        }
      ],
    };
    return this.lineChart;
  };

  // Gauge Chart - Percenatge of total weld that was in WPS range
  gaugeChartsOptions(variable, task) {
    this.gaugeChart = {
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            type: "png"
          }
        }
      },
      title: [{
        top: '8%',
        left: 'center',
        text: 'Weld Within Range Percentage',
        subtext: variable + ' - Task '+ task[0]['TaskID'] + ' Run ' + task[0]['RunNo'],
      },
      {
        text: 'Percentage of total weld duration that was in WPS range',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 10,
          lineHeight: 15,
          fontStyle: 'italic'
        },
        left: '15%',
        top: '95%'
      }],
      series: [
        {
          type: 'gauge',
          startAngle: 180,
          endAngle: 0,
          min: 0,
          max: 1,
          radius: '60%',
          center: ["50%", "70%"],
          itemStyle: {
            color: '#93CE07'
          },
          progress: {
            show: true,
            width: 15,
          },
          axisLine: {
            lineStyle: {
              width: 6,
            }
          },
          pointer: {
            length: '30%',
            width: 5,
            offsetCenter: [0, '-35%'],
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 10,
            lineStyle: {
              width: 1
            }
          },
          axisLabel: {
            distance: -45,
            color: '#999',
            fontSize: 10
          },
          title: {
            offsetCenter: [0, '20%'],
            fontSize: 15
          },
          detail: {
            fontSize: 25,
            offsetCenter: [0, '50%'],
            valueAnimation: true,
            formatter: function (value) {
              return Math.round(value * 100) + '%';
            },
          },
          data: [
            {
              value: (task[2]['Timedelta'] - (task[2][variable + '_Undertime'] + task[2][variable + '_Overtime'])) /
                task[2]['Timedelta'],
              name: 'Duration In Range'
            }
          ]
        }
      ]
    };
    return this.gaugeChart;
  };

  // Pie Chart - Showing Weld Alert distribution (over, under, in range)
  pieChartOptions(variable, task) {
    this.pieChart = {
      toolbox: {
        show: true,
        feature: {
          dataView: {
            readOnly: false
          },
          saveAsImage: {
            type: "png"
          }
        }
      },
      title: {
        top: '8%',
        left: 'center',
        text: 'Weld Alert Distribution',
        subtext: variable + ' - Task '+ task[0]['TaskID'] + ' Run ' + task[0]['RunNo'],
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '25%',
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Duration (min)',
          type: 'pie',
          radius: ['25%', '50%'],
          center: ["50%", "60%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          emphasis: {
            label: {
              show: false,
              fontSize: '20',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          label: {
            show: false,
          },
          data: [
            { value: task[2][variable + '_Undertime'].toFixed(2), name: 'Under Min' },
            {
              value: (task[2]['Timedelta'] - (task[2][variable + '_Undertime'] + task[2][variable + '_Overtime'])).toFixed(2),
              name: 'In Range'
            },
            { value: task[2][variable + '_Overtime'].toFixed(2), name: 'Over Max' },
          ]
        }
      ]
    };
    return this.pieChart;
  };

  // Boxplot - Distribution displaying Q1, Q2 ,Q3
  boxplotOptions(title, variable, task) {
    const data = task[0]['data'].map((item) => {
      return item[variable].toFixed(1);
    });
    this.boxplot = {
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            type: "png"
          }
        }
      },
      title: [{
        top: '8%',
        left: 'center',
        text: 'Weld Boxplot',
        subtext: variable + ' - Task '+ task[0]['TaskID'] + ' Run ' + task[0]['RunNo'],
      },
      {
        text: 'Weld distribution displaying data quartiles and averages',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 10,
          lineHeight: 15,
          fontStyle: 'italic'
        },
        left: '10%',
        top: '95%'
      }
      ],

      dataset: [
        {
          source: [task[0]['data'].map((item) => {
            return item[variable].toFixed(1);
          })]
        },
        {
          transform: {
            type: 'boxplot'
          }
        },
        {
          fromDatasetIndex: 1,
          fromTransformResult: 1
        }
      ],
      tooltip: {
        trigger: 'axis',
      },
      grid: {
        bottom: '15%',
        right: '10%',
        left: '15%',
        top: '30%'
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        nameGap: 30,
        splitArea: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        name: title,
        nameLocation: 'middle',
        nameGap: 35
      },

      series: [
        {
          name: title,
          type: 'boxplot',
          datasetIndex: 1,
          encode: {

            tooltip: ['min', 'Q1', 'Q2', 'Q3', 'max']
          },
          markLine: {
            data: [{
              yAxis: task[1][variable + '_Min'],
              name: variable + ' Min'
            },
            {
              yAxis: task[1][variable + '_Max'],
              name: variable + ' Max'
            },
            ],
            silent: true,
            itemStyle: {
              color: '#ff6028'
            },
          }
        },
        {
          name: 'outlier',
          type: 'scatter',
          datasetIndex: 2
        }
      ]
    };
    return this.boxplot;
  };

  // Radar Chart for alert duration for all params
  radarChartOptions(task) {
    this.radarChart = {
      title: {
        left: 'center',
        text: 'Weld Alert Duration Radar Chart',
        subtext: 'Task '+ task[0]['TaskID'] + ' Run ' + task[0]['RunNo'],
      },
      tooltip: {
        trigger: 'item'
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          saveAsImage: { show: true }
        }
      },
      legend: {
        data: ['Out of Range Duration (mins)'],
        top: '15%'
      },
      color: '#ff6028',
      radar: {
        radius: ["0%", "50%"],
        center: ["50%", "57%"],
        indicator: [
          { name: 'Current', max: task[2]['Timedelta'] },
          { name: 'Voltage', max: task[2]['Timedelta'] },
          { name: 'Travel Speed', max: task[2]['Timedelta'] },
          { name: 'Heat Input', max: task[2]['Timedelta'] },
        ]
      },
      series: [
        {
          areaStyle: {
            color: '#FFDC60'
          },
          name: 'Weld Alert Duration',
          type: 'radar',
          data: [
            {
              value: [
                (task[2]['Current_Undertime'] + task[2]['Current_Overtime']).toFixed(2),
                (task[2]['Voltage_Undertime'] + task[2]['Voltage_Overtime']).toFixed(2),
                (task[2]['TravelSpeed_Undertime'] + task[2]['TravelSpeed_Overtime']).toFixed(2),
                (task[2]['HeatInput_Undertime'] + task[2]['HeatInput_Overtime']).toFixed(2)
              ],
              name: 'Out of Range Duration (mins)'
            },

          ]
        }
      ]
    }
    return this.radarChart;
  };

  // Bar Chart for alert duration for all params - under, in range, and over
  barChartOptions(task) {
    this.barChart = {
      title: {
        left: 'center',
        text: 'Weld Alert Duration Comparison Bar Chart',
        subtext: 'Task '+ task[0]['TaskID'] + ' Run ' + task[0]['RunNo'],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Under Min', 'In Range', 'Over Max'],
        top: '15%'
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['bar', 'stack'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      grid: {
        top: '30%'
      },
      xAxis: [
        {
          type: 'category',
          axisTick: { show: false },
          data: ['Current', 'Voltage', 'Travel Speed', 'Heat Input']
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: 'Duration (mins)',
        }
      ],
      series: [
        {
          name: 'Under Min',
          type: 'bar',
          barGap: 0,
          emphasis: {
            focus: 'series'
          },
          data: [
            task[2]['Current_Undertime'].toFixed(2), 
            task[2]['Voltage_Undertime'].toFixed(2), 
            task[2]['TravelSpeed_Undertime'].toFixed(2), 
            task[2]['HeatInput_Undertime'].toFixed(2)]
        },
        {
          name: 'In Range',
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: [
            (task[2]['Timedelta'] - (task[2]['Current_Undertime'] + task[2]['Current_Overtime'])).toFixed(2),
            (task[2]['Timedelta'] - (task[2]['Voltage_Undertime'] + task[2]['Voltage_Overtime'])).toFixed(2),
            (task[2]['Timedelta'] - (task[2]['TravelSpeed_Undertime'] + task[2]['TravelSpeed_Overtime'])).toFixed(2),
            (task[2]['Timedelta'] - (task[2]['HeatInput_Undertime'] + task[2]['HeatInput_Overtime'])).toFixed(2)
          ]
        },
        {
          name: 'Over Max',
          type: 'bar',
          emphasis: {
            focus: 'series'
          },
          data: [
            task[2]['Current_Overtime'].toFixed(2), 
            task[2]['Voltage_Overtime'].toFixed(2), 
            task[2]['TravelSpeed_Overtime'].toFixed(2), 
            task[2]['HeatInput_Overtime'].toFixed(2)]
        },
      ]
    };
    return this.barChart;
  };

}
