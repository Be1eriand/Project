import { Component, OnInit } from '@angular/core';
import { RealTimeView, Specification, TaskView } from '@app/_models';
import { SpecificationService } from '@app/_services/specification.service';
import { RealtimeService } from '@app/_services/realtime.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-weld-history',
  templateUrl: './weld-history.component.html',
  styleUrls: ['./weld-history.component.sass']
})
export class WeldHistoryComponent implements OnInit {

  allSpec: Specification[];
  specs: Specification[];
  spec: Specification;

  allTasks: TaskView[];
  task: TaskView;

  allRT: RealTimeView[];
  RTtask: RealTimeView;
  RTwelder: RealTimeView;
  RTmachine: RealTimeView;

  constructor(
    private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService,
    private formBuilder:FormBuilder
    ) { }

  ngOnInit(): void {
    this.specificationService.getAllSpecs().subscribe((specs) => this.allSpec = specs);
    this.realtimeSerivce.getTaskData().subscribe((t) => this.allTasks = t);
  }

  loadData(): void {
    console.log(this.allSpec)
  }

  getSpecification(id: string){
    this.specificationService.getSpec(id).subscribe((spec) => this.specs = spec);
    console.log(this.spec)
  }

  getSpecificationRun(id: string, run: string) {
    this.specificationService.getSpecRun(id, run).subscribe((spec) => this.spec = spec);
    console.log(this.spec)
  }

  getRealtime(){
    this.realtimeSerivce.getAllRT().subscribe((rt) => this.allRT = rt);
    console.log(this.allRT)
  }

  getRealtimeTask(id: string){
    this.realtimeSerivce.getRTWelder(id).subscribe((rt) => this.RTtask = rt);
    console.log(this.RTtask)
  }

  getRealtimeWelder(id: string){
    this.realtimeSerivce.getRTWelder(id).subscribe((rt) => this.RTwelder = rt);
    console.log(this.RTwelder)
  }

  getTasks(){
    this.realtimeSerivce.getTaskData().subscribe((t) => this.allTasks = t);
    console.log(this.allTasks)
  }

}
