import { Component } from '@angular/core';
import { AccountService } from './_services';
import { User } from './_models';
import { environment } from '@environments/environment';
import { EventEmitter } from 'stream';
import { HeaderComponent } from './header/header.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
}) 


export class AppComponent {
    isMenuOpened = true; // is true by default when first opened 
    user: User;
    environment = environment;
    title ='WAsP';
    clickEventSubscription: Subscription;
    count:number=0;
    menuEventSubscription: Subscription;
    
    receivedEvent($event){
        this.isMenuOpened = $event
    }
    inccount(){
        this.count++;
    }
    
    onToolbarMenuToggle(){
        console.log('On Toolbar toggled', this.isMenuOpened);
        this.isMenuOpened= !this.isMenuOpened;

    }
    constructor(
        private accountService: AccountService) {
        this.accountService.user.subscribe(x => this.user = x);
        this.clickEventSubscription= this.accountService.getClickEvent().subscribe(()=>{this.onToolbarMenuToggle();})
        //this.menuEventSubscription= this.accountService.getMenuEvent().subscribe(()=>{this.onToolbarMenuToggle})
    }

    logout() {
        this.accountService.logout();
    }
   
    

    }

