import { Component, OnInit } from '@angular/core';
import {environment} from '../../../environments/environment';
import { PubNubAngular } from 'pubnub-angular2';
import * as pubnub from 'pubnub';

@Component({
  selector: 'app-presence',
  templateUrl: './presence.component.html',
  styleUrls: ['./presence.component.scss']
})
export class PresenceComponent implements OnInit{

  users: string[] = [
    'Steve',
    'Tony',
    'Clint',
    'James',
    'Wilson',
    'Bruce'
  ];
  playerList: any = [];
  init: any;
  messages: any[] = [];
  constructor(){
  }

  ngOnInit(){
    this.initialize();
    this.subscribe();
    this.addListners();
  }

  initialize(){
    const uuid = pubnub.generateUUID();
    const payload = {
      publishKey: environment.pubnub.presence.publishKey,
      subscribeKey: environment.pubnub.presence.subscribeKey,
      uuid
    }
    this.init = new pubnub(payload);
  }

  addListners(){
    this.init.addListener({
      status: (response) => {
        if (response.category === "PNConnectedCategory") {
          this.hereNow();
        }
      },
      presence: (response) => {
        if(response.leave!==undefined){
          this.userLeave(response);
        }else{
          switch(response.action){
            case 'join': {
              this.join(response);
              break;
            };
            case 'leave': {
              this.leave(response);
              break;
            };
            default : {
              break;
            }
          }
        }
        console.log("Presence UUIDs:", this.playerList);
      }
    });
  }

  subscribe(){
    const payload = {
      channels: [environment.pubnub.channels.presence],
      withPresence: true,
    };
    this.init.subscribe(payload);
  }
  
  hereNow() {
    // this.init.hereNow(
    //   {
    //     channels: [environment.pubnub.channels.presence],
    //     includeUUIDs: true,
    //     includeState: true
    //   },
    //     (status, response) => {
    //     console.log("hereNow Response: ", response.channels[environment.pubnub.channels.presence].occupants);
    //     if(response.channels[environment.pubnub.channels.presence].occupants){
    //       response.channels[environment.pubnub.channels.presence].occupants.forEach((occupant) => {
    //         this.playerList.push(occupant.uuid);
    //       })
    //     }
    //     console.log("hereNow UUIDs: ", this.playerList);
    //   });
  }

  join(response){
      for(let i=0; i < response.occupancy; i++){
        if(response.uuid !== undefined){
          var uuidMatchJoin = this.playerList.indexOf(response.uuid);
          if(uuidMatchJoin === -1){
            this.playerList.push(response.uuid);
            if(this.users.indexOf(response.uuid) > -1){
              this.messages.push({text: `${response.uuid} joined`, class:'list-group-item-info'});
            }
          }
        }
      }
  }

  leave(response){
        var uuidMatchLeave = this.playerList.indexOf(response.uuid);
        if(uuidMatchLeave > -1){
          this.playerList.splice(uuidMatchLeave, 1);
          this.messages.push({text: `${response.uuid} left`, class:'list-group-item-secondary'});
        }
  }

  userLeave(response){
    for(let i=0; i < response.occupancy; i++){
      var uuidMatchIntervalLeave = this.playerList.indexOf(response.leave[i]);
      if(uuidMatchIntervalLeave > -1){
        this.playerList.splice(uuidMatchIntervalLeave, 1);
        this.messages.push({text: `${response.leave[i]} left`, class:'list-group-item-secondary'});
      }
    }
  }

  message(response){
    console.log('Message event');
  }

}
