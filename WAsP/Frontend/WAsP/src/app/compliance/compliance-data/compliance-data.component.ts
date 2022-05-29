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


<<<<<<< HEAD
    await this.realtimeSerivce.getRTTask(this.contract.TaskID).subscribe({
      next: t => {
        this.realtime = t;

        // If there is weld data available
        if (this.realtime.length > 0) {
          this.taskRun = this.groupTaskService.groupTaskRun(this.realtime);
          this.taskRange = this.groupTaskService.weldActualRange(this.taskRun, this.wps);
          console.log(this.taskRange);
          this.dataReady = true;
=======
    this.realtimeSerivce.getRTTask(this.contract.TaskID).subscribe({
      next: t => {
      this.realtime = t;

      console.log(t);

      // If there is weld data available
      if (this.realtime.length > 0) {
        this.groupTaskRun();
        this.weldActualRange();
        this.taskRange = this.groupTask2();
        this.dataReady = true;
      }
      else{
        this.noData = true;
      }
      this.hideSpinner = true;
    },
    });
  }


  // Group by Task and Run
  groupTaskRun() {
    const merged = this.realtime.reduce((r, { TaskID, RunNo, ...rest }) => {
      const key = `${TaskID}-${RunNo}`;
      r[key] = r[key] || { TaskID, RunNo, data: [] };
      r[key]["data"].push(rest)
      return r;
    }, {})
    this.taskRun = Object.values(merged);
  }

  // Calculate Min and Max values
  weldActualRange() {
    var results = [];

    for (var i in this.taskRun) {
      // For correct run number
      for (var j in this.wps) {

        if (this.wps[j]["Run_No"] == this.taskRun[i]['RunNo']) {

          var result = []
          this.taskRun[i]['data'].reduce((r, a) => {

            if (!r[a.WelderID]) {
              r[a.WelderID] = r[a.WelderID] || {
                RunNo: this.taskRun[i]['RunNo'],
                TaskID: this.taskRun[i]['TaskID'],
                WelderID: a.WelderID,
                MachineID: a.MachineID,
                Date: a.Time.split('T')[0],
                TravelSpeed: 0,
                Timedelta: 0,
                Records: 0,

                Current_Min: a.Current,
                Current_Max: 0,
                Current_Overtime: 0,
                Current_Undertime: 0,
                Current_Overpercent: 0,
                Current_Underpercent: 0,
                Current_Sum: 0,


                Voltage_Min: a.Voltage,
                Voltage_Max: 0,
                Voltage_Overtime: 0,
                Voltage_Undertime: 0,
                Voltage_Overpercent: 0,
                Voltage_Underpercent: 0,
                Voltage_Sum: 0,

                HeatInput_Min: a.HeatInput,
                HeatInput_Max: 0,
                HeatInput_Overtime: 0,
                HeatInput_Undertime: 0,
                HeatInput_Overpercent: 0,
                HeatInput_Underpercent: 0,
                HeatInput_Sum: 0,

                TravelSpeed_Min: a.TravelSpeed,
                TravelSpeed_Max: 0,
                TravelSpeed_Overtime: 0,
                TravelSpeed_Undertime: 0,
                TravelSpeed_Overpercent: 0,
                TravelSpeed_Underpercent: 0,
                TravelSpeed_Sum: 0

              };
              result.push(r[a.WelderID])
            }
            r[a.WelderID].Timedelta += (a.Timedelta / 60);

            r[a.WelderID].Records += 1;

            // Current - Min Max
            r[a.WelderID].Current_Sum += a.Current;
            if (r[a.WelderID].Current_Min > a.Current) {
              r[a.WelderID].Current_Min = a.Current;
            }
            else if (r[a.WelderID].Current_Max < a.Current) {
              r[a.WelderID].Current_Max = a.Current;
            }
            if (a.Current > this.wps[j]["Current_Max"]) {
              r[a.WelderID].Current_Overtime += (a.Timedelta / 60);
              var max = Number(this.wps[j]["Current_Max"]);
              r[a.WelderID].Current_Overpercent = (r[a.WelderID].Current_Max - max) / max * 100;
            }
            else if (a.Current < this.wps[j]["Current_Min"]) {
              r[a.WelderID].Current_Undertime += (a.Timedelta / 60);
              var min = Number(this.wps[j]["Current_Min"]);
              r[a.WelderID].Current_Underpercent = (r[a.WelderID].Current_Min - min) / min * 100;
            }

            // Voltage
            r[a.WelderID].Voltage_Sum += a.Voltage;
            if (r[a.WelderID].Voltage_Min > a.Voltage || (r[a.WelderID].Voltage_Min == 0 && a.Voltage > 0)) {
              r[a.WelderID].Voltage_Min = a.Voltage;
            }
            else if (r[a.WelderID].Voltage_Max < a.Voltage) {
              r[a.WelderID].Voltage_Max = a.Voltage;
            }
            if (a.Voltage > this.wps[j]["Voltage_Max"]) {
              r[a.WelderID].Voltage_Overtime += (a.Timedelta / 60);
              var max = Number(this.wps[j]["Voltage_Max"]);
              r[a.WelderID].Voltage_Overpercent = (r[a.WelderID].Voltage_Max - max) / max * 100;
            }
            else if (a.Voltage < this.wps[j]["Voltage_Min"] && a.Timedelta > 0) {
              r[a.WelderID].Voltage_Undertime += (a.Timedelta / 60);
              var min = Number(this.wps[j]["Voltage_Min"]);
              r[a.WelderID].Voltage_Underpercent = (r[a.WelderID].Voltage_Min - min) / min * 100;
            }

            // Heat Input
            r[a.WelderID].HeatInput_Sum += a.HeatInput;
            if (r[a.WelderID].HeatInput_Min > a.HeatInput || (r[a.WelderID].HeatInput_Min == 0 && a.HeatInput > 0)) {
              r[a.WelderID].HeatInput_Min = a.HeatInput;
            }
            else if (r[a.WelderID].HeatInput_Max < a.HeatInput) {
              r[a.WelderID].HeatInput_Max = a.HeatInput;
            }
            if (a.HeatInput > this.wps[j]["HeatInput_Max"]) {
              r[a.WelderID].HeatInput_Overtime += (a.Timedelta / 60);
              var max = Number(this.wps[j]["HeatInput_Max"]);
              r[a.WelderID].HeatInput_Overpercent = (r[a.WelderID].HeatInput_Max - max) / max * 100;
            }
            else if (a.HeatInput < this.wps[j]["HeatInput_Min"] && a.Timedelta > 0) {
              r[a.WelderID].HeatInput_Undertime += (a.Timedelta / 60);
              var min = Number(this.wps[j]["HeatInput_Min"]);
              r[a.WelderID].HeatInput_Underpercent = (r[a.WelderID].HeatInput_Min - min) / min * 100;
            }

            // Travel Speed
            r[a.WelderID].TravelSpeed_Sum += a.TravelSpeed;
            if (r[a.WelderID].TravelSpeed_Min > a.TravelSpeed || (r[a.WelderID].TravelSpeed_Min == 0 && a.TravelSpeed > 0)) {
              r[a.WelderID].TravelSpeed_Min = a.TravelSpeed;
            }
            else if (r[a.WelderID].TravelSpeed_Max < a.TravelSpeed) {
              r[a.WelderID].TravelSpeed_Max = a.TravelSpeed;
            }
            if (a.TravelSpeed > this.wps[j]["TravelSpeed_Max"]) {
              r[a.WelderID].TravelSpeed_Overtime += (a.Timedelta / 60);
              var max = Number(this.wps[j]["TravelSpeed_Max"]);
              r[a.WelderID].TravelSpeed_Overpercent = (r[a.WelderID].TravelSpeed_Max - max) / max * 100;
            }
            else if (a.TravelSpeed < this.wps[j]["TravelSpeed_Min"] && a.Timedelta > 0) {
              r[a.WelderID].TravelSpeed_Undertime += (a.Timedelta / 60);
              var min = Number(this.wps[j]["TravelSpeed_Min"]);
              r[a.WelderID].TravelSpeed_Underpercent = (r[a.WelderID].TravelSpeed_Min - min) / min * 100;
            }
            

            return r;
          }, {});
>>>>>>> 4bd39d2a6fd34e29775e4c0a24ac36d28fd4369c
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
