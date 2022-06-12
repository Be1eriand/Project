import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { LayoutComponent } from './layout.component';
import { LoginComponent } from './login.component';
import { LoginOutComponent } from '@app/login-out/login-out.component';


@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AccountRoutingModule,
       
    ],
    declarations: [
        LayoutComponent,
        LoginComponent,
       
        //LoginOutComponent,
    ]
})
export class AccountModule { }