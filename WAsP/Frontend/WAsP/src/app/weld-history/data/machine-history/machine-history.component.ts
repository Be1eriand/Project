import { Component, Input, OnInit } from '@angular/core';
import { RealTimeView, Specification, TaskView } from '@app/_models';
import { RealtimeService } from '@app/_services/realtime.service';
import { SpecificationService } from '@app/_services/specification.service';
import { concatMap, from, groupBy, mergeMap, of, toArray, zip } from 'rxjs';

@Component({
  selector: 'app-machine-history',
  templateUrl: './machine-history.component.html',
  styleUrls: ['./machine-history.component.sass']
})
export class MachineHistoryComponent implements OnInit {

  @Input() realtime: RealTimeView[];

  allRealtime: RealTimeView[][];

  taskIDs: string[];
  validTaskID: any[];
  validWpsID: string[];
  wps: Specification[][];
  taskData: TaskView[];

  //groupv2
  result: {};
  taskRun: {};
  taskRange: any[];

  constructor(
    private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService) { }

  async ngOnInit(): Promise<void> {

    // Unique Task IDs
    let tasks: string[] = []
    for (let i = 0; i < this.realtime.length; i++) {
      if (!(tasks.includes(this.realtime[i].TaskID))) {
        tasks.push(this.realtime[i].TaskID);
      }
    }
    this.taskIDs = tasks
    console.log(this.taskIDs);

    // Get Task data to find WPS number
    let taskData: TaskView[][] = []

    for (var i in this.taskIDs) {
      let temp = await this.getTaskData(this.taskIDs[i]);
      taskData.push(temp);
    }

    let task: string[] = [];
    let wps: string[] = []

    for (var i in taskData) {
      if (taskData[i].length > 0) {
        task.push(taskData[i][0].TaskID);
        wps.push(taskData[i][0].WPS_No);
      }
    }
    this.validTaskID = task;
    this.validWpsID = wps


    // Get WPS data and remove duplicates
    let specs: Specification[][] = []

    for (var i in wps) {
      let temp = await this.getWPS(wps[i]);
      specs.push(temp);
    }

    /*    for (var i in specs) {
          let run = 0;
          let dedupeWPS: Specification[] = []
          for (var j in specs[i]) {
            if (specs[i][j].Run_No == String(run + 1)) {
              dedupeWPS.push(specs[i][j]);
              run += 1;
            }
          }
          specs[i] = dedupeWPS;
        } */

    this.wps = specs;

    this.groupTask();
    this.groupTaskRun();

    console.log("group task run", this.taskRun);

    this.weldActualRange();

  }

  groupTask() {
    var result = this.realtime.reduce(function (r, a) {
      r[a.TaskID] = r[a.TaskID] || [];
      r[a.TaskID].push(a);
      return r;
    }, {});

    console.log("v2", result);
    this.result = result;
  }

  groupTaskRun() {

    const merged = this.realtime.reduce((r, { TaskID, RunNo, ...rest }) => {
      const key = `${TaskID}-${RunNo}`;
      r[key] = r[key] || { TaskID, RunNo, data: [] };
      r[key]["data"].push(rest)
      return r;
    }, {})

    this.taskRun = Object.values(merged);
  }

  weldActualRange() {
    var results = [];

    for (var i in this.taskRun) {
      var result = []
      this.taskRun[i]['data'].reduce( (r, a) => {
        if (!r[a.WelderID]) {
          r[a.WelderID] = r[a.WelderID] || {
            WelderID: a.WelderID,
            MachineID: a.MachineID,
            Date: a.Time.split('T')[0],
            TravelSpeed: 0,
            Timedelta: 0,
            Current_Min: a.Current,
            Current_Max: 0,
            Voltage_Min: a.Voltage,
            Voltage_Max: 0,
            Heat_Input_Min: a.HeatInput,
            Heat_Input_Max: 0,
            Interpass_Temp_Min: a.Temperature,
            Interpass_Temp_Max: 0,
            Travel_Speed_Min: a.TravelSpeed,
            Travel_Speed_Max: 0,
            RunNo: this.taskRun[i]['RunNo'],
            TaskID: this.taskRun[i]['TaskID']
          };
          result.push(r[a.WelderID])
        }
        r[a.WelderID].Timedelta += a.Timedelta / 60;
  
        // Current
        if (r[a.WelderID].Current_Min > a.Current || (r[a.WelderID].Current_Min == 0 && a.Current > 0)) {
          r[a.WelderID].Current_Min = a.Current;
        }
        else if (r[a.WelderID].Current_Max < a.Current) {
          r[a.WelderID].Current_Max = a.Current;
        }
  
        // Voltage
        if (r[a.WelderID].Voltage_Min > a.Voltage || (r[a.WelderID].Voltage_Min == 0 && a.Voltage  > 0)) {
          r[a.WelderID].Voltage_Min = a.Voltage;
        }
        else if (r[a.WelderID].Voltage_Max < a.Voltage) {
          r[a.WelderID].Voltage_Max = a.Voltage;
        }
  
        // Heat Input
        if (r[a.WelderID].Heat_Input_Min > a.HeatInput || (r[a.WelderID].Heat_Input_Min == 0 && a.HeatInput > 0)) {
          r[a.WelderID].Heat_Input_Min = a.HeatInput;
        }
        else if (r[a.WelderID].Heat_Input_Max < a.HeatInput) {
          r[a.WelderID].Heat_Input_Max = a.HeatInput;
        }
  
        // Travel Speed
        if (r[a.WelderID].Travel_Speed_Min > a.TravelSpeed || (r[a.WelderID].Travel_Speed_Min == 0 && a.TravelSpeed > 0)) {
          r[a.WelderID].Travel_Speed_Min = a.TravelSpeed;
        }
        else if (r[a.WelderID].Travel_Speed_Max < a.TravelSpeed) {
          r[a.WelderID].Travel_Speed_Max = a.TravelSpeed;
        }
  
        // Interpass Temp
        if (r[a.WelderID].Interpass_Temp_Min > a.Temperature || (r[a.WelderID].Interpass_Temp_Min == 0 && a.Temperature  > 0)) {
          r[a.WelderID].Interpass_Temp_Min = a.Temperature;
        }
        else if (r[a.WelderID].Interpass_Temp_Max < a.Temperature) {
          r[a.WelderID].Interpass_Temp_Max = a.Temperature;
        }
  
        return r;
      }, {});

    }
    results.push(result);
    this.taskRange = results;

    console.log(this.taskRange);
  }


  /*groupTaskID() {
    let group: RealTimeView[][] = []
    from(this.realtime)
      .pipe(
        concatMap(async (res) => res),
        groupBy(
          item => item.TaskID
        ),
        mergeMap(group => zip(of(group.key), group.pipe(toArray())))
      )
      .subscribe(t => {
        group.push(t[1]);
      });
    console.log("g", group);
    this.allRealtime = group;
  }
*/

  /* groupRun(realtime: RealTimeView[]) {
     let group: [string, RealTimeView[]][] = []
     from(realtime)
       .pipe(
         concatMap(async (res) => res),
         groupBy(
           item => item.RunNo
         ),
         mergeMap(group => zip(of(group.key), group.pipe(toArray())))
       )
       .subscribe(t => {
         let group2: [string, RealTimeView[]] = [t[0], t[1]];
         group.push(group2);
       });
 
     return group;
   }
   */

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

  getTaskData(id: string): Promise<TaskView[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let data: TaskView[];
        this.realtimeSerivce.getTask(id).subscribe((t) => {
          data = t;
          resolve(data);
        });
      }, 200);
    });
  }

}

