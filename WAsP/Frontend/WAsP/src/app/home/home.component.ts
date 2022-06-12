import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { User, Task } from '@app/_models';
import { AccountService, DataService, AlertService } from '@app/_services';
import { environment } from '@environments/environment';

@Component({ templateUrl: 'home.component.html',
            styleUrls: ['./home.component.sass'] })
export class HomeComponent {
    user: User;
    task: Task;
    environment = environment;

    constructor(
        private accountService: AccountService,
        private alertService: AlertService,
        private router: Router) {
        this.user = this.accountService.userValue;
    }
   logout() {
        this.accountService.logout();
    }
}