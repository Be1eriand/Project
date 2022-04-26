import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

import { RealtimeRoutingModule } from './realtime-routing.module';

import { LayoutComponent } from './layout.component';
import { DashboardComponent } from './dashboard.component';
import { WidgetComponent } from './widget.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RealtimeRoutingModule,
        MatCardModule,
    ],
    declarations: [
        LayoutComponent,
        DashboardComponent,
        WidgetComponent,
    ]
})
export class RealtimeModule { }