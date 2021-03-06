
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

//Services for the application
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { User } from './_models'
import { AccountService } from './_services'

//Base components of WAsP
import { AppComponent } from './app.component';
import { AlertComponent } from './_components';
import { HomeComponent } from './home';

//Angular imports for prettifying the application
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';

//eCharts import to allow the data to be charted easily
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SideBarComponent } from './side-bar/side-bar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { LoginComponent } from './account/login.component';
import { LoginOutComponent } from './login-out/login-out.component';


@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatProgressSpinnerModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatSidenavModule,
        MatToolbarModule,
        NgxEchartsModule.forRoot({
            echarts
          }),
        LayoutModule,
        MatListModule,
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        FooterComponent,
        HeaderComponent,
        SideBarComponent,
        LoginOutComponent,
        
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})

export class AppModule { 
    user: User;

    constructor(private accountService: AccountService) {
        this.user = this.accountService.userValue;
    }
}