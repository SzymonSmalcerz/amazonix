import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

//our imports:
import { FormsModule } from '@angular/forms'; //for controling forms in angular
import { HttpClientModule } from '@angular/common/http'; //for http calls in angular
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'; // for angular-boostrap

import { RequestService } from './request.service';
import { DataService } from './data.service';
import { HomeComponent } from './home/home.component';
import { MessageComponent } from './message/message.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MessageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,

  ],
  providers: [RequestService,DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
