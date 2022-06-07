import { Component } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
}) 


export class AppComponent {
    opened = false;
    title = 'WAsP';
    user: User;
    environment = environment;

    constructor(
        private accountService: AccountService, 
        ) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
    }
    
    

    }

