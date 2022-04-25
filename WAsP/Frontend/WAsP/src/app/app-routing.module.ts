import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
<<<<<<< HEAD
const realtimeModule = () => import('./realtime/realtime.module').then(x => x.RealtimeModule);
=======
const weldHistoryModule = () => import('./weld-history/weld-history.module').then(x => x.WeldHistoryModule);
>>>>>>> f9dbe20065d5b20fed589604c6ee2a5afe635447

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    //{ path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: 'users', loadChildren: usersModule },
    { path: 'realtime', loadChildren: realtimeModule},

    { path: 'weld-history', loadChildren: weldHistoryModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
