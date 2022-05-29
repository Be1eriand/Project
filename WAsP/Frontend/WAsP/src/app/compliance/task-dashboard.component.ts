import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RealTimeView, Specification, TaskView } from '@app/_models';
import { RealtimeService, SpecificationService } from '@app/_services';
import { GroupTaskService } from '@app/_services/group-task.service';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./compliance.component.sass']
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
    private specificationService: SpecificationService,
    private groupTaskService: GroupTaskService
  ) { }

  ngOnInit(): void {

    this.realtimeSerivce.getTaskData().subscribe((t) => {
      this.allTasks = t;
      this.loadTasks();
    });

    this.taskForm = new FormGroup({
      taskID: new FormControl(''),
    });

  };


  // Loading Task data then making it auto complete and filterable
  loadTasks(): void {
    let tasks = []
    for (let i = 0; i < this.allTasks.length; i++) {
      tasks.push(String(this.allTasks[i].TaskID));
    }
    let uniqueTasks = [...new Set(tasks)];
    this.tasks = uniqueTasks.sort();

    this.filteredTasks = this.tasks
  };
  taskOnKey(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.filteredTasks = this.taskSearch(target.value);
  };
  taskSearch(value: string) {
    let filter = value.toLocaleLowerCase();
    return this.tasks.filter(option => option.toLocaleLowerCase().includes(filter));
  };


  // When a task ID is selected, 
  async taskSelect(task) {

    // Get selected Task
    for (var i in this.allTasks) {
      if (this.allTasks[i].TaskID == task.value) {
        this.selectedTask = this.allTasks[i];
      }
    };

    // WPS of selected task
    this.wps = await this.getWPS(this.selectedTask.WPS_No);

    // Get task ID's realtime weld data
    this.realtime = await this.getRealtime(task.value);

    this.taskRealtime = this.groupTaskService.groupTaskRunforComponents(this.realtime, this.wps);
    this.dataAvail = true;

    if (this.realtime.length < 1) {
      this.dataAvail = false;
    };
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
  };
}
