import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService, AlertService } from '@app/_services';

import { environment } from '@environments/environment';
import { RealTimeView } from '@app/_models';

@Component({ 
    selector: 'realtime-card',
    templateUrl: 'widget.component.html',
    styleUrls: ['widget.component.sass'],    
})

export class WidgetComponent implements OnInit {
    @Input() data: Observable<RealTimeView>;

    constructor(
        private http: HttpClient) {
    }

    ngOnInit(): void {
        
    }
}