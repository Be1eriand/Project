import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const realtimeModule = () => import('./realtime/realtime.module').then(x => x.RealtimeModule);
const weldHistoryModule = () => import('./weld-history/weld-history.module').then(x => x.WeldHistoryModule);
const complianceModule = () => import('./compliance/compliance.module').then(x => x.ComplianceModule);

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard]  },
    { path: 'realtime', loadChildren: realtimeModule, canActivate: [AuthGuard] },

    { path: 'weld-history', loadChildren: weldHistoryModule, canActivate: [AuthGuard]  },
    { path: 'compliance', loadChildren: complianceModule, canActivate: [AuthGuard]  },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
