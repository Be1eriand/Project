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

import { WeldHistoryRoutingModule } from './weld-history-routing.module';
import { WeldHistoryComponent } from './weld-history.component';
import { DataComponent } from './data/data.component';


@NgModule({
  declarations: [
    WeldHistoryComponent,
    DataComponent
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
    MatNativeDateModule
    
  ]
})
export class WeldHistoryModule { }
