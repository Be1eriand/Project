import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RealTimeView } from '@app/_models';
import { TaskView } from '@app/_models';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  constructor(
      private router: Router,
      private http: HttpClient
  ) { }

  getTaskData(): Observable<TaskView[]>{
    return this.http.get<TaskView[]>(`${environment.apiUrl}/data/tasks/`)
  }

  getTask(task: string): Observable<TaskView[]>{
    return this.http.get<TaskView[]>(`${environment.apiUrl}/data/tasks/${task}`)
  }

  getAllRT(): Observable<RealTimeView[]> {
    return this.http.get<RealTimeView[]>(`${environment.apiUrl}/data/realtime`)
            .pipe();
  }

  getRTTask(task: string): Observable<RealTimeView> {
    return this.http.get<RealTimeView>(`${environment.apiUrl}/data/realtime/task/${task}`)
  }

  getRTWelder(welder: string): Observable<RealTimeView> {
    return this.http.get<RealTimeView>(`${environment.apiUrl}/data/realtime/welder/${welder}`)
  }

  getRTMachine(machine: string): Observable<RealTimeView> {
    return this.http.get<RealTimeView>(`${environment.apiUrl}/data/realtime/machine/${machine}`)
  }

}


    