import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RealTimeView, Specification, TaskView } from '@app/_models';
import { RealtimeService, SpecificationService } from '@app/_services';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['../compliance.component.sass']
})
export class TaskDashboardComponent implements OnInit {

  taskForm: FormGroup;
  allTasks: TaskView[];
  filteredTasks: string[];
  tasks: string[];

  taskRun: {};
  results: {};

  taskRealtime: any[];

  selectedTask: TaskView;

  wps: Specification[];
  realtime: RealTimeView[];

  dataAvail: boolean = true;
 
  constructor(
    private realtimeSerivce: RealtimeService,
    private specificationService: SpecificationService
  ) { }

  ngOnInit(): void {
    
    this.realtimeSerivce.getTaskData().subscribe((t) => {
      this.allTasks = t;
      this.loadTasks();
    });

    this.taskForm = new FormGroup({
      taskID: new FormControl(''),

    })
    
  }


    // Loading Task data then making it auto complete and filterable
    loadTasks(): void {
      let tasks = []
      for (let i = 0; i < this.allTasks.length; i++){
        tasks.push(String(this.allTasks[i].TaskID));
      }
      let uniqueTasks = [...new Set(tasks)];
      this.tasks = uniqueTasks.sort();
  
      this.filteredTasks = this.tasks
    }
    taskOnKey(e: Event) {
      const target = e.target as HTMLTextAreaElement;
      this.filteredTasks = this.taskSearch(target.value);
    }
    taskSearch(value: string) {
      let filter = value.toLocaleLowerCase();
      return this.tasks.filter(option => option.toLocaleLowerCase().includes(filter));
    }


    async taskSelect(task) {

      console.log(task.value);

      // Selected Task
      for (var i in this.allTasks){
        if (this.allTasks[i].TaskID == task.value) {
          this.selectedTask = this.allTasks[i];
        }
      }

      // WPS of selected task
      this.wps = await this.getWPS(this.selectedTask.WPS_No);

      // Get task ID's realtime weld data
      this.realtime = await this.getRealtime(task.value);

      console.log("wps", this.wps);
      console.log("realtime", this.realtime);

      this.groupTaskRun();
      this.dataAvail = true;

      if (this.realtime.length < 1){
        this.dataAvail = false;
      }

    }

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

    getRealtime(id: string): Promise<RealTimeView[]> {
      return new Promise((resolve) => {
        setTimeout(() => {
          let data: RealTimeView[];
          this.realtimeSerivce.getRTTask(id).subscribe((t) => {
            data = t;
            resolve(data);
          });
        }, 200);
      });
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
          taskWPS.push(this.weldActualRange(i,j));
        }
      }

      tasks.push(taskWPS);
    }
    this.taskRealtime = tasks;

    console.log("taskRun", this.taskRealtime);
  }

  // Calculate Min and Max values
  weldActualRange(i,j) {
          var result = []
          this.taskRun[i]['data'].reduce((r, a) => {

            if (!r[a.WelderID]) {
              r[a.WelderID] = r[a.WelderID] || {
                TaskID: this.taskRun[i]['TaskID'],
                RunNo: this.taskRun[i]['RunNo'],
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

    return result[0];

  }

}
