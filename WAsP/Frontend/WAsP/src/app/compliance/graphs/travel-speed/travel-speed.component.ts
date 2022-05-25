import { Component, Input, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ChartsService } from '@app/_services/charts.service';

@Component({
  selector: 'app-travel-speed',
  templateUrl: './travel-speed.component.html',
  styleUrls: ['../../compliance.component.sass']
})
export class TravelSpeedComponent implements OnInit {

  @Input() task: [][];

  lineChart: EChartsOption = {};
  gaugeChart: EChartsOption = {};
  pieChart: EChartsOption = {};
  boxplot: EChartsOption = {};

  dataAvail: boolean = false

  variable: string = 'TravelSpeed';
  title: string = 'Travel Speed (mm/min)';

  constructor(private chartsService: ChartsService) { }

  ngOnInit(): void {
    if (this.task.length > 0) {

      this.dataAvail = true;

      if (this.task[1][this.variable + '_Min'] == this.task[1][this.variable + '_Max']){
        this.lineChart = this.chartsService.lineChartOptions(this.title, this.variable, this.task);
      }
      else {
        this.lineChart = this.chartsService.lineChartMinMaxOptions(this.title, this.variable, this.task);
      }
      this.gaugeChart = this.chartsService.gaugeChartsOptions(this.title, this.variable, this.task);
      this.pieChart = this.chartsService.pieChartOptions(this.title, this.variable, this.task);
      this.boxplot = this.chartsService.boxplotOptions(this.title, this.variable, this.task);

    }
  }

}
