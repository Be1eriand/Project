import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { FlexLayoutModule } from '@angular/flex-layout';

import { SpecificationRoutingModule } from './specification-routing.module';

import { SpecificationComponent } from './specification.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SpecificationRoutingModule,
        MatCardModule,
        MatTabsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        FlexLayoutModule,
    ],
    declarations: [
        SpecificationComponent,
    ]
})
export class SpecificationModule { }