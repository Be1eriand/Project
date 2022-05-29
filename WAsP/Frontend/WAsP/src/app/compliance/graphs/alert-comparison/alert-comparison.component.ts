import { Component, Input, OnInit } from '@angular/core';
import { ChartsService } from '@app/_services/charts.service';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-alert-comparison',
  templateUrl: './alert-comparison.component.html',
  styleUrls: ['../../compliance.component.sass']
})
export class AlertComparisonComponent implements OnInit {

  @Input() task: [][];

  radarChart: EChartsOption = {};
  barChart: EChartsOption = {};

  dataAvail: boolean = false

  constructor(private chartsService: ChartsService) { }

  ngOnInit(): void {
    if (this.task.length > 0) {

      this.dataAvail = true;

      this.radarChart = this.chartsService.radarChartOptions(this.task);
      this.barChart = this.chartsService.barChartOptions(this.task);    

    }
  }


}
