import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/_helpers';

import { LayoutComponent } from './layout.component';
import { ChangePasswordComponent } from './changepassword.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'changepassword', component: ChangePasswordComponent, canActivate: [AuthGuard] },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }