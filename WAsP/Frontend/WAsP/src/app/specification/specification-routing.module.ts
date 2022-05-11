import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from '@app/_helpers';

import { LayoutComponent } from './layout.component';
import { SpecificationComponent } from './specification.component';

const routes: Routes = [
    {
        path: '', component: SpecificationComponent, canActivate: [AuthGuard],
        //children: [
        //    { path: 'view', component: SpecificationComponent, canActivate: [AuthGuard] },
        //]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SpecificationRoutingModule { }