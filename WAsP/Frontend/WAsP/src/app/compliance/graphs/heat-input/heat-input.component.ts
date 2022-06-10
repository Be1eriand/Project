import { Component, Input, OnInit } from '@angular/core';
import { ChartsService } from '@app/_services/charts.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-heat-input',
  templateUrl: './heat-input.component.html',
  styleUrls: ['../../compliance.component.sass']
})
export class HeatInputComponent implements OnInit {

  @Input() task: [][];

  lineChart: EChartsOption = {};
  gaugeChart: EChartsOption = {};
  pieChart: EChartsOption = {};
  boxplot: EChartsOption = {};

  dataAvail: boolean = false

  variable: string = 'HeatInput';
  title: string = 'Heat Input (Kj/mm)';

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
      this.gaugeChart = this.chartsService.gaugeChartsOptions(this.variable, this.task);
      this.pieChart = this.chartsService.pieChartOptions(this.variable, this.task);
      this.boxplot = this.chartsService.boxplotOptions(this.title, this.variable, this.task);

    }
  }
}
