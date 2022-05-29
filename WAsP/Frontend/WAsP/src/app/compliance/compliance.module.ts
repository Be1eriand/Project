import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplianceRoutingModule } from './compliance-routing.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComplianceComponent } from './compliance.component';
import { ComplianceDataComponent } from './compliance-data/compliance-data.component';

import { TaskDashboardComponent } from './task-dashboard.component';
import { CurrentComponent } from './graphs/current/current.component';
import { VoltageComponent } from './graphs/voltage/voltage.component';
import { HeatInputComponent } from './graphs/heat-input/heat-input.component';
import { TravelSpeedComponent } from './graphs/travel-speed/travel-speed.component';
import { AlertComparisonComponent } from './graphs/alert-comparison/alert-comparison.component';

import * as echarts from 'echarts/core';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  declarations: [
    ComplianceComponent,
    ComplianceDataComponent,
    TaskDashboardComponent,
    CurrentComponent,
    VoltageComponent,
    HeatInputComponent,
    TravelSpeedComponent,
    AlertComparisonComponent,
  ],
  imports: [
    CommonModule,
    ComplianceRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTabsModule,
    NgxEchartsModule.forRoot({
      echarts
    }),
    
  ]
})
export class ComplianceModule { }
