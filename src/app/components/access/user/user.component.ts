import { Component, OnInit, Input } from '@angular/core';
import { PubNubAngular } from 'pubnub-angular2';
import {environment} from '../../../../environments/environment';
import { Key } from 'protractor';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  @Input('payload')
  payload: any;
  instance: any;
  message: string;
  history: any[] = [];
  constructor(private pubnub: PubNubAngular) { }

  ngOnInit() {
    this.pubnub.init({
      publishKey: environment.pubnub.publishKey,
      subscribeKey: environment.pubnub.subscribeKey,
      authKey: this.payload.key
    });
    this.subscribe();
  }

  subscribe(){
    this.pubnub.subscribe({
      channels: [environment.pubnub.channels.access]
    });
    this.pubnub.addListener({
      message: (m) => {
        this.history.push(m);
      }
    })
  }

  publish(){
    if(this.message){
      const payload = {
        message: {
          user: this.payload.name, 
          message: this.message
        },
        channel: environment.pubnub.channels.access
      }
      this.pubnub.publish(payload, (status, response) => {
        console.log(status, response);
      });
      this.message = null;
    }
  }

}
