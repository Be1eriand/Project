import { Component } from '@angular/core';

import { User, Task } from '@app/_models';
import { AccountService, DataService, AlertService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    task: Task;

    constructor(
        private accountService: AccountService,
        private alertService: AlertService) {
        this.user = this.accountService.userValue;
    }
}