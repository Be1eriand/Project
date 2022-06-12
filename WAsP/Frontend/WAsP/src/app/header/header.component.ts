
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SideBarComponent } from '@app/side-bar/side-bar.component';
import { User } from '@app/_models/user';
import { AccountService } from '@app/_services/account.service';
import { environment } from '@environments/environment';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {
  
    isMenuOpened = true; // isMENUHTSOpened
    title = 'WAsP';
    user: User;
    environment = environment;
  


    onToolbarMenuToggle(){
        console.log('On Toolbar toggled', this.isMenuOpened); //not sure ?? fix 
        this.isMenuOpened= !this.isMenuOpened;
        //this.isMenuOpened.emit(this.isMenuOpened);

    }
   constructor(private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
          }
  
    

    ngOnInit(): void {

    }
  
    logout() {
        this['accountService'].logout();
    }
   
    // headerClick(){
    //     this.accountService.sendMenuEvent();
    // }

}
