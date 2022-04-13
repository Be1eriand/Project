import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountService } from './_services';
import { User } from './_models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
}) 

export class AppComponent {
    title = 'WAsP';
    user: User;

    constructor(private accountService: AccountService, private http: HttpClient) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
    }
}