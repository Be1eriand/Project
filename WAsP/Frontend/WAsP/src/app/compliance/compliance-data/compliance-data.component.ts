import { Component, Input, OnInit } from '@angular/core';
import { ContractTaskView, RealTimeView, Specification } from '@app/_models';
import { GroupTaskService } from '@app/_services/group-task.service';
import { RealtimeService, SpecificationService } from '@app/_services';

@Component({
  selector: 'app-compliance-data',
  templateUrl: './compliance-data.component.html',
  styleUrls: ['./compliance-data.component.sass']
})
export class ComplianceDataComponent implements OnInit {

  // Angular Material WPS table columns
  wpsColumns: string[] = ['Run_No', 'WPS_No', 'Welding_Code', 'Joint_type', 'Side', 'Position',
    'Size', 'Class', 'Gas_Flux_Type', 'Current', 'Voltage', 'Polarity', 'TravelSpeed', 'InterpassTemp', 'HeatInput'];

  // Angular Material Weld Actual range table columns
  actualColumns: string[] = ['RunActual', 'Date', 'Duration', 'CurrentActual', 'CurrentAvg', 'VoltageActual', 'VoltageAvg',
    'TravelSpeedActual', 'TravelSpeedAvg', 'HeatInputActual', 'HeatInputAvg'];

  @Input() contract: ContractTaskView;

  realtime: RealTimeView[];
  wps: Specification[];

  results: {};
  taskRun: {};
  taskRange: any[]

  dataReady: boolean = false;
  noData: boolean = false;
  hideSpinner: boolean = false;

  constructor(private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService,
    private groupTaskService: GroupTaskService) { }

  async ngOnInit(): Promise<void> {

    console.log('contract', this.contract);

    this.wps = await this.getWPS(this.contract.WPS_No);


    await this.realtimeSerivce.getRTTask(this.contract.TaskID).subscribe({
      next: t => {
        this.realtime = t;

        // If there is weld data available
        if (this.realtime.length > 0) {
          this.taskRun = this.groupTaskService.groupTaskRun(this.realtime);
          this.taskRange = this.groupTaskService.weldActualRange(this.taskRun, this.wps);
          console.log(this.taskRange);
          this.dataReady = true;
        }
        else {
          this.noData = true;
        }
        this.hideSpinner = true;
      },
    });
  };

  // Calls to get relevant WPS data
  getWPS(id: string): Promise<Specification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data: Specification[];
        this.specificationService.getSpec(id).subscribe({
          next: (t) => {
            data = t;
            resolve(data);
          },
        });
      }, 200);
    });
  };

}
