import { Component } from '@angular/core';

import { User, Task } from '@app/_models';
import { AccountService, DataService, AlertService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    task: Task;

    constructor(
        private accountService: AccountService,
        private alertService: AlertService,
        private dataService: DataService) {
        this.user = this.accountService.userValue;
    }

    data() {
        this.dataService.post()
        .pipe()
        .subscribe({
            next: () => {
            },
            error: error => {
                this.alertService.error(error);
            }
        });

    }
}