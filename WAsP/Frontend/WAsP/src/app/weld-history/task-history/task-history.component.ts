import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RealTimeView, Specification, TaskView } from '@app/_models';
import { RealtimeService, SpecificationService } from '@app/_services';
import { GroupTaskService } from '@app/_services/group-task.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['../weld-history.component.sass']
})
export class TaskHistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  wpsColumns: string[] = ['Run_No', 'WPS_No', 'Welding_Code', 'Joint_type', 'Side', 'Position',
    'Size', 'Class', 'Gas_Flux_Type', 'Current', 'Voltage', 'Polarity', 'TravelSpeed', 'InterpassTemp', 'HeatInput'];

  actualColumns: string[] = ['RunActual', 'Date', 'Duration', 'Welder', 'Machine', 'CurrentActual', 'CurrentAvg', 'VoltageActual', 'VoltageAvg',
    'TravelSpeedActual', 'TravelSpeedAvg', 'HeatInputActual', 'HeatInputAvg'];

  allDataColumns: string[] = ['RunNo', 'Time', 'WelderID', 'MachineID', 'Current', 'Voltage',
    'TravelSpeed', 'HeatInput', 'Temperature'];
  public allDataList = new MatTableDataSource<any>();

  @Input() task: TaskView;

  noData: boolean = false;
  dataReady: boolean = false;
  hideSpinner: boolean = false;

  realtime: RealTimeView[];
  wps: Specification[];
  taskRealtime: any[];

  taskRun: {};
  taskRange: any[]


  constructor(private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService,
    private groupTaskService: GroupTaskService
  ) { }

  async ngOnInit(): Promise<void> {

    await this.specificationService.getSpec(this.task.WPS_No).subscribe((t) => {
      this.wps = t;
    });

    await this.realtimeSerivce.getRTTask(this.task.TaskID).subscribe(t => {
      this.realtime = t;
      this.allDataList.data = this.realtime;

      this.allDataList.filterPredicate = function (data, filter: string): boolean {
        return data.RunNo.toString().toLowerCase().includes(filter);
      };

      // If there is weld data available
      if (this.realtime.length > 0) {
        this.taskRun = this.groupTaskService.groupTaskRun(this.realtime);
        this.taskRange = this.groupTaskService.weldActualRange(this.taskRun, this.wps);
        this.dataReady = true;
        this.allDataList.paginator = this.paginator;
        this.allDataList.sort = this.sort;
      }
      else {
        this.noData = true;
      }
      this.hideSpinner = true;
    });
    this.allDataList = new MatTableDataSource(this.realtime);
  }

  applyFilter(event: Event): void {
    const filter = (event.target as HTMLInputElement).value.trim().toLocaleLowerCase();
    this.allDataList.filter = filter;
    if (this.allDataList.paginator) {
      this.allDataList.paginator.firstPage();
    }
  }

}


