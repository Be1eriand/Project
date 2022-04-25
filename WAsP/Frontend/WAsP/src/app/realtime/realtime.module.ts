import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { RealtimeRoutingModule } from './realtime-routing.module';

import { LayoutComponent } from './layout.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RealtimeRoutingModule,
    ],
    declarations: [
        LayoutComponent,
    ]
})
export class RealtimeModule { }