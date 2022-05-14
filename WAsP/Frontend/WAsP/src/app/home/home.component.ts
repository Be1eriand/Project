import { Component } from '@angular/core';

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
        private alertService: AlertService) {
        this.user = this.accountService.userValue;
    }
}