import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WeldHistoryComponent } from './weld-history.component';

const routes: Routes = [
  {
    path: '',
    component: WeldHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WeldHistoryRoutingModule { }
