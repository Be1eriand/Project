
import { Component, OnInit, Output } from '@angular/core';
import { User } from '@app/_models/user';
import { AccountService } from '@app/_services/account.service';
import { environment } from '@environments/environment';
import * as EventEmitter from 'events';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  @Output() sideBarToggled = new EventEmitter();
  menuStatus:boolean = false;
  [x: string]: any;
    opened = false;
    title = 'WAsP';
    user: User;
    environment = environment;

   constructor(private accountService: AccountService, 
                
                ) {
        this.accountService.user.subscribe(x => this.user = x);
    }

  ngOnInit(): void {

  }
  SideNavToggle(){
    this.menuStatus = !this.menuStatus;
    this.sideBarToggled.emit(this.menuStatus.toString());
  }
  logout() {
        this['accountService'].logout();
    }

}
