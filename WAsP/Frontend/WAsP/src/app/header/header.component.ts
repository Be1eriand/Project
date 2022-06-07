
import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models/user';
import { AccountService } from '@app/_services/account.service';
import { environment } from '@environments/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
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
  logout() {
        this['accountService'].logout();
    }

}
