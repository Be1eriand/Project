import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';

import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { ColorPickerModule } from 'ngx-color-picker';

import { RealtimeRoutingModule } from './realtime-routing.module';

import { DashboardComponent } from './dashboard.component';
import { WidgetComponent } from './widget.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RealtimeRoutingModule,
        MatCardModule,
        MatBadgeModule,
        MatSelectModule,
        ColorPickerModule,
        FlexLayoutModule,
        NgxEchartsModule.forRoot({
            echarts
          }),
    ],
    declarations: [
       DashboardComponent,
       WidgetComponent,
    ],
    exports: [
        DashboardComponent,
        WidgetComponent,
    ]
})
export class RealtimeModule { }


export class lineColour {
    colour: string;
    line: string;
}

export class specDetails {
    name: string;
    units: string;
}

export class ActiveMachine {
    MachineID: string;
    active: boolean;
    nAlerts: number;
}

export let specList = {
    "Voltage": "Volts",
    "Current": "Amps",
    "HeatInput": "KJ/mm",
    "TravelSpeed": "mm/min"
}