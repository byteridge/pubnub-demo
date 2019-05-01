import { Component, OnInit, Input } from '@angular/core';
import { PubNubAngular } from 'pubnub-angular2';
import { environment } from 'src/environments/environment';
import * as pubnub from 'pubnub';
@Component({
  selector: 'app-chat-users',
  templateUrl: './chat-users.component.html',
  styleUrls: ['./chat-users.component.scss']
})
export class ChatUsersComponent implements OnInit{

  @Input('user')
  user: string;
  subscribed: boolean;
  @Input('init')
  init: any;
  uuid: string;
  constructor(private pubnub: PubNubAngular) { }

  ngOnInit(){
    this.uuid = pubnub.generateUUID();
    this.init =  new pubnub({
      publishKey: environment.pubnub.presence.publishKey,
      subscribeKey: environment.pubnub.presence.subscribeKey,
      uuid: this.user
    });
  }

  subscribe(){
    const payload = {
      channels: [environment.pubnub.channels.presence],
      withPresence: true,
    };
    this.init.subscribe(payload);
    this.subscribed = true;
  }

  unsubscribe(){
    this.init.unsubscribe({channels: [environment.pubnub.channels.presence]});
    this.subscribed = false;
  }

  ngOnDestroy(){
    this.unsubscribe();
  }
}
