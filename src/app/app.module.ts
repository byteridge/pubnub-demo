import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PresenceComponent } from './components/presence/presence.component';
import { PubNubAngular } from 'pubnub-angular2';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FunctionsComponent } from './components/functions/functions.component';
import { AccessComponent } from './components/access/access.component';
import { UserComponent } from './components/access/user/user.component';
import { ChatUsersComponent } from './components/presence/chat-users/chat-users.component';
import { DemoComponent } from './components/demo/demo.component';

@NgModule({
  declarations: [
    AppComponent,
    PresenceComponent,
    FunctionsComponent,
    AccessComponent,
    UserComponent,
    ChatUsersComponent,
    DemoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule, 
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [PubNubAngular],
  bootstrap: [AppComponent]
})
export class AppModule { }
