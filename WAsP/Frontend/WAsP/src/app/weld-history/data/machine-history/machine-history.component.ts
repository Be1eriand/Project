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

  time: string[];
  taskIDs: string[];
  allRealtime: RealTimeView[][];

  validTaskID: any[];
  validWpsID: string[];
  wps: Specification[][];

  taskData: TaskView[];

  realtimeData: RealTimeView[];

  constructor(
    private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService) 
    { }

  async ngOnInit(): Promise<void> {

    

    //let times = []
    //for (let i = 0; i < this.realtime.length; i++) {
      //this.temp.dates.push(this.realtime[i].Time);
     // times.push(this.realtime[i].Time);
   // }

    //this.time = times;

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
      if (taskData[i].length > 0){
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

    for (var i in specs) {
      let run = 0;
      let dedupeWPS: Specification[] = []
      for (var j in specs[i]){
        if (specs[i][j].Run_No == String(run + 1)){
          dedupeWPS.push(specs[i][j]); 
          run+= 1;
        }
      }
      specs[i] = dedupeWPS;
    }
    
    this.wps = specs;

    this.groupTaskID();
     
     this.range();


     console.log(this.wps);


  }

  groupTaskID() {
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
  
  groupRun(realtime: RealTimeView[]){
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

  range(){

    console.log(this.allRealtime);
    console.log(this.allRealtime[0]);

    for (var i in this.allRealtime[-1]){

      console.log("here?")

      console.log(this.allRealtime[i][0]);

      // Keep Realtime data only
      let realtime = this.allRealtime[i][1];
      let min = realtime.Current;
      let max = realtime.Current;

      //for (let j = 1; j < realtime.length; j++){
       // if (realtime[j].Current < min){
        //  min = realtime[j].Current;
        //}
       // else if (realtime[j].Current > max) {
        //  max = realtime[j].Current;
        //} 
          
      //}


    }
  }


  // delete
  getRealtimeTask(id: string): Promise<RealTimeView> {
    return new Promise((resolve) => {
      setTimeout(() => {
          let data: RealTimeView;
          this.realtimeSerivce.getRTTask(id).subscribe((rt) => {
            data = rt;
            resolve(data);
          });          
      }, 200);
  });
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

  getTaskData(id: string): Promise<TaskView[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
          let data: TaskView[];
          this.realtimeSerivce.getTask(id).subscribe((t) => {
            data = t;
            resolve(data);
          });          
      }, 500);
  });
  }

}

