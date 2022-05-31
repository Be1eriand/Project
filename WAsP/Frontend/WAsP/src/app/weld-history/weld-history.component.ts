import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskView } from '@app/_models';
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

  showWelder: boolean = false;
  showTask: boolean = false;
  showMachine: boolean = false;

  task: TaskView[];

 constructor(private realtimeSerivce: RealtimeService) { }

  ngOnInit(): void {
    this.realtimeSerivce.getTaskData().subscribe({
      next: t => {
      this.allTasks = t;
      this.loadWelders();
      this.loadMachines();
      this.loadTasks();
      },
    });

    this.taskForm = new FormGroup({
      taskID: new FormControl('')
    });

    this.welderForm = new FormGroup({
      welderName: new FormControl('')
    });

    this.machineForm = new FormGroup({
      machineName: new FormControl('')
    });
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
    this.showTask = true;
  }

  welderSubmit() {
    if (!this.welderForm.value.welderName || !(this.filteredWelders.includes(this.welderForm.value.welderName))) {
      alert('Please select a valid welder');
      return;
    }
    var t = []
    for (var i in this.allTasks){
      
      if (this.allTasks[i].FullName == this.welderForm.value.welderName) {
        t.push(this.allTasks[i]);
        this.task = t;
      }
    }
    this.showWelder = true;
  }

  machineSubmit() {
    if (!this.machineForm.value.machineName || !(this.filteredMachines.includes(this.machineForm.value.machineName))) {
      alert('Please select a valid machine');
      return;
    }
    var t = []
    for (var i in this.allTasks){
      
      if (this.allTasks[i].MachineName == this.machineForm.value.machineName) {
        t.push(this.allTasks[i]);
        this.task = t;
      }
    }
    this.showMachine = true;
  }
}
