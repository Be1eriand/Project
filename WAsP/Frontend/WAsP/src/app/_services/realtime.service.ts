import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TaskView } from '@app/_models';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import { RealTimeView } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  constructor(
      private router: Router,
      private http: HttpClient
  ) { }

  getTaskData(): Observable<TaskView[]>{
    return this.http.get<TaskView[]>(`${environment.apiUrl}/data/tasks/`);
  }

  getAllRT(): Observable<RealTimeView[]> {
    return this.http.get<RealTimeView[]>(`${environment.apiUrl}/data/realtime`);
  }

  getRT(task: string, run: string, seconds: string): Observable<RealTimeView[]> {
    return this.http.get<RealTimeView[]>(`${environment.apiUrl}/data/realtime?seconds=${seconds}&task=${task}&run=${run}`);
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
