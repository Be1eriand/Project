import { Component } from '@angular/core';

import { AccountService } from './_services';
import { User } from './_models';
import { environment } from '@environments/environment';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
}) 


export class AppComponent {
    opened = false;
    user: User;
    environment = environment;
    title = 'HeaderSideNav';
    sideNavStatus: boolean = false;
    SideNavToggle: any; //This is dodgy and should be changed to the correct type

    constructor(
        private accountService: AccountService, 
        ) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    logout() {
        this.accountService.logout();
    }
    
    

    }

