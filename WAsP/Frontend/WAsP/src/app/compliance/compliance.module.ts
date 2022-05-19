import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComplianceRoutingModule } from './compliance-routing.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComplianceComponent } from './compliance.component';
import { ComplianceDataComponent } from './compliance-data/compliance-data.component';

@NgModule({
  declarations: [
    ComplianceComponent,
    ComplianceDataComponent
  ],
  imports: [
    CommonModule,
    ComplianceRoutingModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatExpansionModule,
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule
    
  ]
})
export class ComplianceModule { }
