import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AccountService } from '@app/_services/account.service';
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.sass']
  
})
export class SideBarComponent implements OnInit {
    isMenuOpened = true;

  @Output() sidebarEvent = new EventEmitter<boolean>();
  @Output() headerEventSide = new EventEmitter<boolean>();

  onToolbarMenuToggle(){
        console.log('On Toolbar toggled', this.isMenuOpened);
        this.isMenuOpened= !this.isMenuOpened;

    }
  
isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, 
    private accountService: AccountService ) { }

  ngOnInit(): void {
  }
   clickMe(){ //  pink click needs to move into side bar 
        this.accountService.sendClickEvent(); 
    }
    sendEvent(){
        this.sidebarEvent.emit()

    }      
    sendMenuEvent(){
        this.headerEventSide.emit(this.isMenuOpened)}

}
