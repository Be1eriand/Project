import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Components
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { WeldHistoryRoutingModule } from './weld-history-routing.module';
import { WeldHistoryComponent } from './weld-history.component';
import { DataComponent } from './data/data.component';
import { WelderHistoryComponent } from './data/welder-history/welder-history.component';
import { MachineHistoryComponent } from './data/machine-history/machine-history.component';
import { TaskHistoryComponent } from './data/task-history/task-history.component';


@NgModule({
  declarations: [
    WeldHistoryComponent,
    DataComponent,
    WelderHistoryComponent,
    MachineHistoryComponent,
    TaskHistoryComponent
  ],
  imports: [
    CommonModule,
    WeldHistoryRoutingModule,
    MatTabsModule,
    MatIconModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    
  ]
})
export class WeldHistoryModule { }
