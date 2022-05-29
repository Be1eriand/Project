import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComplianceComponent } from './compliance.component';
import { TaskDashboardComponent } from './task-dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: ComplianceComponent
  },
  {
    path: 'TaskDashboard',
    component: TaskDashboardComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplianceRoutingModule { }
