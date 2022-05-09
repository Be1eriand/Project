import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ContractTaskView, RealTimeView, Specification, TaskView } from '@app/_models';
import { RealtimeService } from '@app/_services/realtime.service';
import { SpecificationService } from '@app/_services/specification.service';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.sass']
})
export class ComplianceComponent implements OnInit {

  contractForm: FormGroup;

  tasks: string[];
  RTtask: RealTimeView;
  allTasks: TaskView[];
  filteredTasks: string[];
  contractID: string[];
  
  
  maxDate: Date;
  showTask: boolean = false;

  
  allContracts: ContractTaskView[];
  contracts: string[];
  wps: Specification[][];

  constructor(private specificationService: SpecificationService,
    private realtimeSerivce: RealtimeService,
    ) { 
      this.maxDate = new Date();
    }

  ngOnInit(): void {
    this.realtimeSerivce.getTaskData().subscribe(t => {
      this.allTasks = t;
      this.loadTasks();
    }); 

    this.specificationService.getAllContracts().subscribe(c => {
      this.allContracts = c;
      this.loadContracts();
      console.log(this.allContracts);
    })

    this.contractForm = new FormGroup({
      contractName: new FormControl('')
    })
  }

  loadContracts(): void {
    let contracts = []
    for (let i = 0; i < this.allContracts.length; i++){
      contracts.push(String(this.allContracts[i].ContractName));
    }
    let uniqueContracts = [...new Set(contracts)];
    this.contracts = uniqueContracts.sort();
  }

  contractSubmit() {

    console.log(this.contractForm);
    if (!this.contractForm.value.contractName) {
      alert('Please select a contract');
      return;
    }

    let contracts = []
    for(var i in this.allContracts) {
      if (this.allContracts[i].ContractName === this.contractForm.value.contractName){
        contracts.push(this.allContracts[i])
      }
    }
    console.log(contracts);

    // Get WPS data
    if (contracts.length > 0) {
      let wps: Specification[][] = [];
      for (var j in contracts) {
        this.specificationService.getSpec(contracts[j].WPS_No).subscribe(w => wps.push(w));
      }
      this.wps = wps;
      console.log(this.wps);

      // Get realtime data
      var realtime: RealTimeView[][] = []
      let test: any = []
      for (var k in contracts) {
        var taskID: RealTimeView[] = []
        console.log(contracts[k].TaskID);
        let id = String(contracts[k].TaskID);
        console.log(id);
        //this.realtimeSerivce.getRTTask(id).subscribe(t => {taskID.push(t);realtime.push(taskID);})
        this.realtimeSerivce.getRTTask('1').subscribe(t => test = t)
      }
      console.log(test);
      console.log(realtime);

    }

    //this.realtimeSerivce.getRTTask(id).subscribe((rt) => this.RTtask = rt);


    //this.getRealtimeTask(this.taskForm.value.taskID);
    //this.showTask = true;
    //console.log(this.RTtask);

    
  }


  loadTasks(): void {
    let tasks = []
    for (let i = 0; i < this.allTasks.length; i++){
      tasks.push(String(this.allTasks[i].TaskID));
    }
    let uniqueTasks = [...new Set(tasks)];
    this.tasks = uniqueTasks.sort();

    this.filteredTasks = this.tasks;
  }
  taskOnKey(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.filteredTasks = this.taskSearch(target.value);
  }
  taskSearch(value: string) {
    let filter = value.toLocaleLowerCase();
    return this.tasks.filter(option => option.toLocaleLowerCase().includes(filter));
  }
  taskSubmit() {

    console.log(this.contractForm);
    if (!this.contractForm.value.taskID) {
      alert('Please select a task ID');
      return;
    }
    this.getRealtimeTask(this.contractForm.value.taskID);
    this.showTask = true;
    console.log(this.RTtask);
    
  }

  getRealtimeTask(id: string){
    this.realtimeSerivce.getRTTask(id).subscribe((rt) => this.RTtask = rt);
    console.log(this.RTtask)
  }
}
