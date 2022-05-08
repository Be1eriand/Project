import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RealtimeRoutingModule } from './realtime-routing.module';

import { DashboardComponent } from './dashboard.component';
import { WidgetComponent } from './widget.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RealtimeRoutingModule,
        MatCardModule,
        FlexLayoutModule,
        NgxEchartsModule.forRoot({
            echarts
          }),
    ],
    declarations: [
        DashboardComponent,
        WidgetComponent,
    ]
})
export class RealtimeModule { }