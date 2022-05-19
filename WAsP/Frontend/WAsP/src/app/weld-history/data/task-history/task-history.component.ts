import { Component, Input, OnInit } from '@angular/core';
import { RealTimeView, Specification, TaskView } from '@app/_models';
import { RealtimeService, SpecificationService } from '@app/_services';

@Component({
  selector: 'app-task-history',
  templateUrl: './task-history.component.html',
  styleUrls: ['../../weld-history.component.sass']
})
export class TaskHistoryComponent implements OnInit {

  wpsColumns: string[] = ['Run_No', 'WPS_No', 'Welding_Code', 'Joint_type', 'Side',  'Position', 
    'Size', 'Class', 'Gas_Flux_Type',  'Current', 'Voltage', 'Polarity', 'TravelSpeed', 'InterpassTemp', 'HeatInput'];

  actualColumns: string[] = ['RunActual', 'Date',  'Duration', 'Welder', 'Machine', 'CurrentActual', 'CurrentAvg', 'VoltageActual', 'VoltageAvg', 
    'TravelSpeedActual', 'TravelSpeedAvg', 'HeatInputActual', 'HeatInputAvg'];

  @Input() task: TaskView;

  noData: boolean = false;
  dataReady: boolean = false;
  hideSpinner: boolean = false;
  showLine: boolean = true;

  realtime: RealTimeView[];
  wps: Specification[];
  taskRealtime: any[];

  results: {};
  taskRun: {};
  taskRange: any[]


  constructor(private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService) { }

  async ngOnInit(): Promise<void> {

    this.wps = await this.getWPS(this.task.WPS_No);

    await this.realtimeSerivce.getRTTask(this.task.TaskID).subscribe(t => {
      this.realtime = t;

      // If there is weld data available
      if (this.realtime.length > 0) {
        this.groupTaskRun();
        this.weldActualRange();
        this.taskRange = this.groupTask2();
        this.dataReady = true;
      }
      else {
        this.noData = true;
      }
      this.hideSpinner = true;
    })
  }

  // Group by Task and Run
  groupTaskRun() {
    var tasks = []
    const merged = this.realtime.reduce((r, { TaskID, RunNo, ...rest }) => {
      const key = `${TaskID}-${RunNo}`;
      r[key] = r[key] || { TaskID, RunNo, data: [] };
      r[key]["data"].push(rest)
      return r;
    }, {})
    this.taskRun = Object.values(merged);

    
    // Creating data to parse to charts components
    for (var i in this.taskRun){
      var taskWPS = []
      for (var j in this.wps) {
        if (this.wps[j]["Run_No"] == this.taskRun[i]['RunNo']){
          taskWPS.push(this.taskRun[i]);
          taskWPS.push(this.wps[j]);
        }
      }
      tasks.push(taskWPS);
      this.taskRealtime = tasks;
    }
    this.taskRealtime = tasks;
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
        }
      }

    }
    results.push(result);
    this.results = results;
  }

  // After collecting Min Max value by run, group by Task ID again
  groupTask2() {
    var result = this.results[0].reduce(function (r, a) {
      r[a.TaskID] = r[a.TaskID] || [];
      r[a.TaskID].push(a);
      return r;
    }, {});
    return result;
  }

  // Calls to get relevant WPS data
  getWPS(id: string): Promise<Specification[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data: Specification[];
        this.specificationService.getSpec(id).subscribe((t) => {
          data = t;
          resolve(data);
        });
      }, 200);
    });
  }

  showLineGraphs(){
    this.showLine = !this.showLine;
  }


}

