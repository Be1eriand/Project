import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { RealTimeView, TaskData, Active } from '@app/_models';

@Injectable({
    providedIn: 'root'
  })
export class SocketService {
    rtSocketListener: WebSocketSubject<RealTimeView[]>;
    tdSocketListener: WebSocketSubject<TaskData[]>;
    amSocketListener: WebSocketSubject<Active[]>;

    constructor(
    ) { 
        console.log('Socket service is created');
        //this.tdSocketListener = webSocket<TaskData[]>(`${environment.socketUrl}/socket/active/`);
        this.amSocketListener = webSocket<any[]>(`${environment.socketUrl}/socket/active/`)
    }
    
   getRTstream(task: string, run: string) : Observable<RealTimeView[]> {
      console.log('Getting RT Stream!');
      return webSocket<RealTimeView[]>(`${environment.socketUrl}/socket/realtime/${task}/${run}`).asObservable();
    }

    getActiveMachines(): Observable<TaskData[]> {
      console.log('Getting Active Machines!');
      return this.tdSocketListener.asObservable();
    }

    getActiveMachines2(): Observable<Active[]> {
      console.log('Getting Active Machines!');
      return this.amSocketListener.asObservable();
    }
}