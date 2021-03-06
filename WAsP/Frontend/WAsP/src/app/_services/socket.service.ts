import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

import { RealTimeView, TaskData, Active, RTAlert } from '@app/_models';

@Injectable({
    providedIn: 'root'
  })
export class SocketService {
    rtSocketListener: WebSocketSubject<RealTimeView[]>;
    tdSocketListener: WebSocketSubject<TaskData[]>;
    amSocketListener: WebSocketSubject<Active[]>;
    alertSocketListener: WebSocketSubject<RTAlert[]>;

    constructor(
    ) { 
        //this.tdSocketListener = webSocket<TaskData[]>(`${environment.socketUrl}/socket/active/`);
        this.amSocketListener = webSocket<any[]>(`${environment.socketUrl}/socket/active/`)
    }
    
    getRTstream(machine: string) : Observable<RealTimeView[]> {
      return webSocket<RealTimeView[]>(`${environment.socketUrl}/socket/realtime/${machine}`).asObservable();
    }

    getActiveMachines(): Observable<TaskData[]> {
      return this.tdSocketListener.asObservable();
    }

    getActiveMachines2(): Observable<Active[]> {
      return this.amSocketListener.asObservable();
    }

    getRealTimeAlert(machine: string): Observable<RTAlert> {
      return webSocket<RTAlert>(`${environment.socketUrl}/socket/alert/${machine}`).asObservable();
    }
}