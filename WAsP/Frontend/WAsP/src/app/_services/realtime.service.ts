import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TaskView } from '@app/_models';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

import { RealTimeView } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {

  constructor(
      private http: HttpClient
  ) { }

  getTaskData(): Observable<TaskView[]>{
    return this.http.get<TaskView[]>(`${environment.apiUrl}/data/tasks`);
  }

  getTask(task: string): Observable<TaskView[]>{
    return this.http.get<TaskView[]>(`${environment.apiUrl}/data/tasks/${task}`)
  }

  getAllRT(): Observable<RealTimeView[]> {
    return this.http.get<RealTimeView[]>(`${environment.apiUrl}/data/realtime`);
  }

  getRT(task: string, run: string, seconds: string): Observable<RealTimeView[]> {
    return this.http.get<RealTimeView[]>(`${environment.apiUrl}/data/realtime?seconds=${seconds}&task=${task}&run=${run}`);
  }

  getRTTask(task: string): Observable<RealTimeView[]> {
    return this.http.get<RealTimeView[]>(`${environment.apiUrl}/data/realtime/task/${task}`)
  }

  getRTWelder(welder: string): Observable<RealTimeView> {
    return this.http.get<RealTimeView>(`${environment.apiUrl}/data/realtime/welder/${welder}`)
  }

  getRTMachine(machine: string): Observable<RealTimeView> {
    return this.http.get<RealTimeView>(`${environment.apiUrl}/data/realtime/machine/${machine}`)
  }
}


    