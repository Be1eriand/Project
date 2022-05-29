import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ContractTaskView, RealTimeView, Specification, TaskView } from '@app/_models';
import { SpecificationService } from '@app/_services/specification.service';
import { RealtimeService } from '@app/_services/realtime.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-weld-history',
  templateUrl: './weld-history.component.html',
  styleUrls: ['./weld-history.component.sass']
})
export class WeldHistoryComponent implements OnInit {

  @ViewChild(MatAccordion) accordion: MatAccordion;

  taskForm: FormGroup;
  welderForm: FormGroup;
  machineForm: FormGroup;

  welders: string[];
  machines: string[];
  tasks: string[];

  allTasks: TaskView[];

  filteredWelders: string[];
  filteredTasks: string[];
  filteredMachines: string[];

  maxDate: Date;

  showWelder: boolean = false;
  showTask: boolean = false;
  showMachine: boolean = false;

  task: TaskView[];


  welderID: FormControl;
  machineID: FormControl;
  dateStart: FormControl;
  dateEnd: FormControl;

  // needed?
  allSpec: Specification[];
  spec: Specification;
  specs: Specification[];
  contract: ContractTaskView[];

  temp: RealTimeView[];
 
  allRT: RealTimeView[];
  RTtask: RealTimeView[];
  RTwelder: RealTimeView;
  realtime: any=[];

  @ViewChild('pdfWelders')
  pdfWelders!: ElementRef;
  
 constructor(
    private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService,
    ) { 
      this.maxDate = new Date();
    }

  ngOnInit(): void {
    this.realtimeSerivce.getTaskData().subscribe(t => this.allTasks = t); 
    
    this.specificationService.getAllSpecs().subscribe((specs) => {
      this.allSpec = specs;
      this.loadWelders();
      this.loadMachines();
      this.loadTasks();
    });

    this.taskForm = new FormGroup({
      taskID: new FormControl(''),
      dateStart: new FormControl(''),
      dateEnd: new FormControl('')
    })

    this.welderForm = new FormGroup({
      welderID: new FormControl(''),
      dateStart: new FormControl(''),
      dateEnd: new FormControl('')
    })

    this.machineForm = new FormGroup({
      machineID: new FormControl(''),
      dateStart: new FormControl(''),
      dateEnd: new FormControl(''),
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

  // Only unique values and sort welder names to it's own array. Then make a filterable array
  loadWelders(): void {  
    let welders = []
    for (let i = 0; i < this.allTasks.length; i++){
      welders.push(this.allTasks[i].FullName);
    }
    let uniqueWelders = [...new Set(welders)];
    this.welders = uniqueWelders.sort();

    this.filteredWelders = this.welders;
  }
  // Filter for welder field
  welderOnKey(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.filteredWelders = this.welderSearch(target.value);
  }
  welderSearch(value: string) {
    let filter = value.toLocaleLowerCase();
    return this.welders.filter(option => option.toLocaleLowerCase().includes(filter));
  }


  // Only unique values and sort machine names to it's own array. Then make a filterable array
  loadMachines(): void {  
    let machines = []
    for (let i = 0; i < this.allTasks.length; i++){
      machines.push(this.allTasks[i].MachineName);
    }
    let uniqueMachines = [...new Set(machines)];
    this.machines = uniqueMachines.sort();

    this.filteredMachines = this.machines;
  }
  // Filter for machines field
  machineOnKey(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.filteredMachines = this.machineSearch(target.value);
  }
  machineSearch(value: string) {
    let filter = value.toLocaleLowerCase();
    return this.machines.filter(option => option.toLocaleLowerCase().includes(filter));
  }

  taskSubmit() {

    console.log(this.taskForm);
    if (!this.taskForm.value.taskID || !(this.filteredTasks.includes(this.taskForm.value.taskID ))) {
      alert('Please select a valid task ID');
      return;
    }

    var t = []
    for (var i in this.allTasks){
      if (this.allTasks[i].TaskID == this.taskForm.value.taskID) {
        t.push(this.allTasks[i]);
        this.task = t;
      }
    }

    this.dateStart = this.taskForm.value.dateStart;
    this.dateEnd = this.taskForm.value.dateEnd;
    this.showTask = true;
  }

  welderSubmit() {

    console.log(this.welderForm);
    if (!this.welderForm.value.welderID || !(this.filteredWelders.includes(this.welderForm.value.welderID))) {
      alert('Please select a valid welder');
      return;
    }

    this.welderID = this.welderForm.value.welderID;
    this.dateStart = this.welderForm.value.dateStart;
    this.dateEnd = this.welderForm.value.dateEnd;
    console.log(this.welderID, this.dateStart, this.dateEnd);
    this.showWelder = true;
  }

  machineSubmit() {

    console.log(this.machineForm);
    if (!this.machineForm.value.machineID || !(this.filteredMachines.includes(this.machineForm.value.machineID))) {
      alert('Please select a valid machine');
      return;
    }

    var re = /[a-zA-Z]+\s/; // all letters and trailling space
    this.dateStart = this.machineForm.value.dateStart;
    this.dateEnd = this.machineForm.value.dateEnd;
    this.getRealtimeMachine(this.machineForm.value.machineID.replace(re, ""))
    this.showMachine = true;
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
    this.realtimeSerivce.getRTTask(id).subscribe((rt) => this.RTtask = rt);
    console.log(this.RTtask)
  }

  getRealtimeWelder(id: string){
    this.realtimeSerivce.getRTWelder(id).subscribe((rt) => this.RTwelder = rt);
    console.log(this.RTwelder)
  }

  getRealtimeMachine(id: string){
    let machine: RealTimeView[] = [];
    this.realtimeSerivce.getRTMachine(id).subscribe((rt) => {machine.push(rt);
    this.realtime = machine;
    console.log(machine);
    });
    
  }

  getTasks(){
    this.realtimeSerivce.getTaskData().subscribe((t) => this.allTasks = t);
    console.log(this.allTasks)
  }

  getContracts(){
    this.specificationService.getAllContracts().subscribe((rt) => this.contract = rt);
    console.log(this.contract)
  }


}
