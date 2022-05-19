import { NgModule } from '@angular/core';
import { RouterModule, Routes, RouterLink } from '@angular/router';

import { HomeComponent } from './home';
import { DashboardComponent } from './productivity/dashboard.component';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const realtimeModule = () => import('./realtime/realtime.module').then(x => x.RealtimeModule);
const specificationModule = () => import('./specification/specification.module').then(x => x.SpecificationModule);
const weldHistoryModule = () => import('./weld-history/weld-history.module').then(x => x.WeldHistoryModule);
const complianceModule = () => import('./compliance/compliance.module').then(x => x.ComplianceModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'account', loadChildren: accountModule },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard]  },
    { path: 'realtime', loadChildren: realtimeModule, canActivate: [AuthGuard] },
    { path: 'specification', loadChildren: specificationModule, canActivate: [AuthGuard] },
    { path: 'weld-history', loadChildren: weldHistoryModule, canActivate: [AuthGuard]  },
    { path: 'compliance', loadChildren: complianceModule, canActivate: [AuthGuard]  },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, RouterLink]
})
export class AppRoutingModule { }
