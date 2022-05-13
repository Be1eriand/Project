import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountService } from './_services';
import { User } from './_models';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
}) 

export class AppComponent {
    title = 'WAsP';
    user: User;
    environment = environment;

    constructor(private accountService: AccountService, private http: HttpClient) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
    }
}