import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Material Components
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { WeldHistoryRoutingModule } from './weld-history-routing.module';
import { WeldHistoryComponent } from './weld-history.component';
import { TaskHistoryComponent } from './task-history/task-history.component';

import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    WeldHistoryComponent,
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
    MatButtonModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    DatePipe
  ]
})
export class WeldHistoryModule { }
